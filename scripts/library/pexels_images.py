#!/usr/bin/env python3
"""Pick Pexels photos for library articles and save them as WebP.

  PEXELS_API_KEY=... python scripts/library/pexels_images.py [--only slug1,slug2] [--inline 2] [--force]

For each content/library/<slug>.json without a cover, searches Pexels with a query built from the
article (image ideas from the manuscript, else focus keyword + place words), skips photos already used
by another article, downloads a landscape photo, writes public/images/library/<slug>.webp (cover, 1600w)
and <slug>-1.webp, <slug>-2.webp (inline, 1200w), and records alt text and photographer credit.
Requires: Pillow. Pexels licence: free to use, attribution appreciated (we credit every cover).
"""
import argparse, io, json, os, re, sys, time, urllib.parse, urllib.request
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
LIB = ROOT / 'content' / 'library'
OUT = ROOT / 'public' / 'images' / 'library'
USED = LIB.parent / 'library-pexels-used.json'
STOP = set('the a an and or of in on at to for with vs from your you how what is are best guide turkey türkiye turkiye 2026 2027 itinerary day days complete'.split())


def api(path, key):
    req = urllib.request.Request(f'https://api.pexels.com/v1/{path}', headers={'Authorization': key, 'User-Agent': 'ito-library-images/1.0'})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code == 429:
                time.sleep(30 * (attempt + 1)); continue
            raise
    raise RuntimeError('Pexels rate limit')


def download(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'ito-library-images/1.0'})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def save_webp(data, dest, width):
    im = Image.open(io.BytesIO(data)).convert('RGB')
    if im.width > width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    im.save(dest, 'WEBP', quality=80, method=6)


def queries(article):
    ideas = [re.sub(r'\(.*?\)|WebP', '', i).split('.')[0].strip() for i in article.get('imageIdeas', []) if i]
    title = re.split(r'[:—–]', article['title'])[0]
    words = [w for w in re.findall(r"[A-Za-zÇĞİÖŞÜçğıöşü'-]+", f"{title} {article['focusKeyword']}") if w.lower() not in STOP]
    base = ' '.join(dict.fromkeys(words))[:60]
    place = 'Turkey' if not re.search(r'istanbul|turkey|türkiye', base, re.I) else ''
    qs = ideas + [f'{base} {place}'.strip(), f"{article['focusKeyword']} Turkey", f"{article['category'].split('&')[0]} Turkey"]
    return [q for q in dict.fromkeys(q.strip() for q in qs) if q]


def alt_text(photo, article, index):
    alt = (photo.get('alt') or '').strip().rstrip('.')
    topic = re.split(r'[:—–]', article['title'])[0].strip()
    return f'{alt} — {topic}' if alt else f'{topic}, Türkiye (photo {index + 1})'


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--only')
    ap.add_argument('--inline', type=int, default=2)
    ap.add_argument('--force', action='store_true')
    args = ap.parse_args()
    key = os.environ.get('PEXELS_API_KEY')
    if not key:
        sys.exit('Set PEXELS_API_KEY first (free key from https://www.pexels.com/api/).')
    OUT.mkdir(parents=True, exist_ok=True)
    used = set(json.loads(USED.read_text())) if USED.exists() else set()
    only = set(args.only.split(',')) if args.only else None
    for f in sorted(LIB.glob('*.json')):
        article = json.loads(f.read_text())
        slug = article['slug']
        if only and slug not in only:
            continue
        if article.get('cover') and not args.force:
            continue
        picked = []
        for q in queries(article):
            res = api('search?' + urllib.parse.urlencode({'query': q, 'orientation': 'landscape', 'per_page': 30, 'size': 'large'}), key)
            for photo in res.get('photos', []):
                if photo['id'] in used or any(p['id'] == photo['id'] for p in picked):
                    continue
                picked.append(photo)
                if len(picked) >= 1 + args.inline:
                    break
            if len(picked) >= 1 + args.inline:
                break
        if not picked:
            print(f'{slug}: no photo found'); continue
        images = []
        for i, photo in enumerate(picked):
            name = f'{slug}.webp' if i == 0 else f'{slug}-{i}.webp'
            save_webp(download(photo['src']['large2x']), OUT / name, 1600 if i == 0 else 1200)
            used.add(photo['id'])
            entry = {'src': f'/images/library/{name}', 'alt': alt_text(photo, article, i), 'credit': photo['photographer'], 'creditUrl': photo['photographer_url'], 'sourceUrl': photo['url']}
            if i == 0:
                article['cover'], article['coverAlt'] = entry['src'], entry['alt']
                article['coverCredit'] = {'name': photo['photographer'], 'url': photo['photographer_url'], 'sourceUrl': photo['url']}
            else:
                images.append(entry)
        article['images'] = images
        f.write_text(json.dumps(article, ensure_ascii=False, indent=2) + '\n')
        USED.write_text(json.dumps(sorted(used)))
        print(f'{slug}: {len(picked)} photos ({picked[0]["photographer"]})')
        time.sleep(1)


if __name__ == '__main__':
    main()
