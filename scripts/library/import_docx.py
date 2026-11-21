#!/usr/bin/env python3
"""Convert the owner-supplied ITO article manuscripts (.docx) into content/library/*.json.

Usage:
  python scripts/library/import_docx.py --docs <folder of .docx> --plan <400 plan.xlsx> --plan <401-700 plan.xlsx> [--only 1,2,5] [--start 2026-05-01] [--end 2026-11-21]

Requires: python-docx, openpyxl.
Structure expected in every manuscript: Heading 1 title, a "Quick Answer:" paragraph,
numbered Heading 2 sections, one table, a "Frequently Asked Questions" Heading 2 with
Heading 3 questions, and a closing ITO independence paragraph.
"""
import argparse, datetime, json, re, sys
from pathlib import Path
import docx, openpyxl
from docx.oxml.ns import qn

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'content' / 'library'
MEDICAL = re.compile(r'\b(medical|clinic|clinical|dental|surgery|surgical|hair transplant|implant|treatment|rhinoplasty|ivf|recovery|doctor|hospital|veneer|bariatric|aesthetic)\b', re.I)
SLUG = re.compile(r'^[a-z0-9]+(?:-[a-z0-9]+)*$')


def load_plan(paths):
    plan = {}
    for p in paths:
        ws = openpyxl.load_workbook(p, read_only=True).active
        rows = ws.iter_rows(values_only=True)
        head = next(rows)
        for r in rows:
            if not r or r[0] is None:
                continue
            row = dict(zip(head, r))
            plan[int(row['No'])] = row
    return plan


def run_text(run):
    return ''.join(t.text or '' for t in run.iter(qn('w:t')))


def para_markdown(p):
    """Paragraph text with hyperlinks kept as [text](url)."""
    out = []
    rels = p.part.rels
    for child in p._p:
        if child.tag == qn('w:r'):
            out.append(run_text(child))
        elif child.tag == qn('w:hyperlink'):
            text = ''.join(run_text(r) for r in child.iter(qn('w:r')))
            rid = child.get(qn('r:id'))
            url = rels[rid].target_ref if rid and rid in rels else None
            out.append(f'[{text}]({url})' if url and text.strip() else text)
    return ''.join(out).strip()


def links_in(text):
    return re.findall(r'\[([^\]]+)\]\((https?://[^)]+)\)', text)


def cell_markdown(cell):
    return ' '.join(para_markdown(p) for p in cell.paragraphs if para_markdown(p)).strip()


def iter_blocks(document):
    body = document.element.body
    for child in body.iterchildren():
        if child.tag == qn('w:p'):
            yield 'p', docx.text.paragraph.Paragraph(child, document)
        elif child.tag == qn('w:tbl'):
            yield 't', docx.table.Table(child, document)


def strip_number(text):
    return re.sub(r'^\d+\.\s*', '', text).strip()


def clamp(text, limit):
    text = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', text).strip()
    if len(text) <= limit:
        return text
    cut = text[:limit]
    sentence = cut.rfind('. ')
    if sentence > limit * 0.6:
        return cut[:sentence + 1]
    return cut[:cut.rfind(' ')].rstrip(',;:–— ') + '…'


def seo_title(h1):
    if len(h1) <= 60:
        return h1
    head = h1.split(':')[0].strip()
    return head if len(head) <= 60 else clamp(h1, 60)


def parse(path):
    d = docx.Document(str(path))
    title, quick, body, faq, table_seen = None, None, [], [], False
    in_faq, pending_q, bullets = False, None, []
    raw_json, meta_header, h2_count = False, None, 0

    def flush():
        nonlocal bullets
        if bullets:
            body.append({'type': 'ul', 'items': bullets})
            bullets = []

    for kind, el in iter_blocks(d):
        if kind == 't':
            flush()
            rows = [[cell_markdown(c) for c in r.cells] for r in el.rows]
            rows = [r for r in rows if any(r)]
            if rows:
                body.append({'type': 'table', 'head': rows[0], 'rows': rows[1:]})
                table_seen = True
            continue
        style, text = el.style.name, para_markdown(el)
        if not text:
            continue
        if style == 'Heading 1':
            title = el.text.strip()
            continue
        if text.startswith('SEO Title:'):
            meta_header = el.text
            continue
        if raw_json or re.match(r'^[^A-Za-z0-9\[]*(\{|<script|```)', text):
            raw_json = True  # pasted JSON-LD; the site generates its own schema
            continue
        if quick is None and text.lower().startswith('quick answer'):
            quick = re.sub(r'^quick answer:\s*', '', text, flags=re.I)
            continue
        if style == 'Heading 2' or text.lower().startswith('frequently asked'):
            flush()
            if text.lower().startswith('frequently asked'):
                in_faq = True
                continue
            in_faq = False
            h2_count += 1
            body.append({'type': 'h2', 'text': strip_number(el.text)})
            continue
        if style == 'Heading 3' and not in_faq and h2_count >= 4 and el.text.strip().endswith('?') and not faq:
            flush()
            in_faq = True
        if in_faq:
            if style == 'Heading 3' and not el.text.strip().endswith('?'):
                in_faq = False
                flush()
                body.append({'type': 'h3', 'text': el.text.strip()})
                continue
            if style == 'Heading 3':
                pending_q = el.text.strip()
            elif pending_q:
                faq.append({'q': pending_q, 'a': text})
                pending_q = None
            else:
                in_faq = False
                body.append({'type': 'p', 'text': text})
            continue
        if style == 'Heading 3':
            flush()
            body.append({'type': 'h3', 'text': el.text.strip()})
            continue
        is_list = el._p.pPr is not None and el._p.pPr.numPr is not None
        if is_list or re.match(r'^\s*[•●▪\-–]\s*', el.text):
            bullets.append(re.sub(r'^\s*[•●▪\-–]\s*', '', text))
            continue
        flush()
        body.append({'type': 'p', 'text': text})
    flush()
    return title, quick, body, faq, table_seen, meta_header


def spread_dates(numbers, start, end):
    span = (end - start).days
    ordered = sorted(numbers)
    return {n: (start + datetime.timedelta(days=round(i * span / max(len(ordered) - 1, 1)))).isoformat() for i, n in enumerate(ordered)}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--docs', required=True)
    ap.add_argument('--plan', action='append', required=True)
    ap.add_argument('--only')
    ap.add_argument('--start', default=datetime.date.today().isoformat())
    ap.add_argument('--end', default=datetime.date.today().isoformat())
    args = ap.parse_args()
    plan = load_plan(args.plan)
    files = {int(f.name.split('-')[0]): f for f in Path(args.docs).glob('*.docx') if f.name[:3].isdigit()}
    dates = spread_dates(files, datetime.date.fromisoformat(args.start), datetime.date.fromisoformat(args.end))
    only = {int(x) for x in args.only.split(',')} if args.only else None
    OUT.mkdir(parents=True, exist_ok=True)
    report = []
    for no, f in sorted(files.items()):
        if only and no not in only:
            continue
        row = plan.get(no)
        if not row:
            report.append(f'{no:03}: not in plan, skipped'); continue
        title, quick, body, faq, table_seen, meta_header = parse(f)
        hdr = {}
        if meta_header:
            keys = ['SEO Title', 'Meta Description', 'Target URL', 'Focus Keyword', 'Body Word Count', 'Image Idea 1 (WebP)', 'Image Idea 2 (WebP)', 'Image Idea 3 (WebP)']
            pattern = '(' + '|'.join(re.escape(k) for k in keys) + '):'
            parts = re.split(pattern, meta_header)
            hdr = {parts[i]: parts[i + 1].strip() for i in range(1, len(parts) - 1, 2)}
        target = str(row['Hedef_URL']).replace('https://itineraryofturkiye.com', '')
        slug = target.rstrip('/').split('/')[-1]
        if not SLUG.match(slug):
            report.append(f'{no:03}: bad slug {slug!r}'); continue
        text = ' '.join([quick or ''] + [b.get('text', '') for b in body] + [i for b in body for i in b.get('items', [])] + [c for b in body for r in [b.get('head', [])] + b.get('rows', []) for c in r])
        words = len(re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', text + ' ' + ' '.join(q['a'] for q in faq)).split())
        sources, seen = [], set()
        for chunk in [b.get('text', '') for b in body] + [i for b in body for i in b.get('items', [])] + [c for b in body for r in b.get('rows', []) for c in r] + [q['a'] for q in faq] + [quick or '']:
            for label, url in links_in(chunk):
                if 'itineraryofturkiye.com' in url or url in seen:
                    continue
                seen.add(url)
                sources.append({'title': label, 'url': url})
        issues = [m for m, bad in [('no title', not title), ('no quick answer', not quick), ('no table', not table_seen), (f'{len(faq)} FAQ', len(faq) != 6)] if bad]
        record = {
            'schemaVersion': 1,
            'id': f'ito-lib-{no:03}',
            'no': no,
            'slug': slug,
            'plannedPath': target,
            'status': 'published',
            'title': title or row['H1_Baslik'],
            'seoTitle': hdr.get('SEO Title') if 0 < len(hdr.get('SEO Title', '')) <= 60 else seo_title(title or row['H1_Baslik']),
            'metaDescription': hdr.get('Meta Description') if 0 < len(hdr.get('Meta Description', '')) <= 150 else clamp(quick or '', 150),
            'imageIdeas': [hdr[k] for k in hdr if k.startswith('Image Idea')],
            'quickAnswer': quick or '',
            'category': row['Kategori_Adi'],
            'focusKeyword': row['Odak_Anahtar_Kelime'],
            'cover': '',
            'images': [],
            'dateISO': dates[no],
            'readTime': f'{max(3, round(words / 220))} min read',
            'medical': bool(MEDICAL.search(f"{row['Kategori_Adi']} {title}")),
            'body': body,
            'faq': faq,
            'sources': sources,
            'provenance': 'Owner-supplied manuscript imported from .docx; structure checked automatically, not independently fact-checked by the import.',
        }
        existing = OUT / f'{slug}.json'
        if existing.exists():  # keep photos picked earlier
            prev = json.loads(existing.read_text())
            for k in ('cover', 'coverAlt', 'coverCredit', 'images', 'updatedISO', 'dateISO', 'medical'):
                if prev.get(k):
                    record[k] = prev[k]
        (OUT / f'{slug}.json').write_text(json.dumps(record, ensure_ascii=False, indent=2) + '\n')
        report.append(f'{no:03} {slug} words={words} faq={len(faq)} sources={len(sources)} medical={record["medical"]}' + (f' ISSUES: {", ".join(issues)}' if issues else ''))
    print('\n'.join(report))


if __name__ == '__main__':
    sys.exit(main())
