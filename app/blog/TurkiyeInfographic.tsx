import type { ContentLocale } from '@/lib/blog-content.mjs';
import { articleCopy } from './articleCopy';

export type InfographicStats = {
  dateISO: string;
  updatedISO?: string;
  readTime: string;
  sourceCount: number;
  languageCount: number;
};

/**
 * Closing "Türkiye at a glance" panel shown under every Journal article.
 * The three cards carry verifiable facts only; the stats row is the article's own data.
 */
export default function TurkiyeInfographic({ locale, stats }: { locale: ContentLocale; stats: InfographicStats }) {
  const copy = articleCopy[locale];
  const info = copy.info;
  const fmt = (value: string) => new Date(`${value}T00:00:00Z`).toLocaleDateString(copy.dateLocale, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
  const items = [
    { label: info.statPublished, value: fmt(stats.dateISO) },
    ...(stats.updatedISO && stats.updatedISO !== stats.dateISO ? [{ label: info.statUpdated, value: fmt(stats.updatedISO) }] : []),
    { label: info.statRead, value: stats.readTime },
    ...(stats.sourceCount > 0 ? [{ label: info.statSources, value: String(stats.sourceCount) }] : []),
    { label: info.statLanguages, value: String(Math.max(1, stats.languageCount)) },
  ];

  return (
    <section className="tig" aria-labelledby="tig-title" lang={locale}>
      <style>{`
        .tig { background: radial-gradient(120% 140% at 0% 0%, #0c3555 0%, #071726 55%, #050f1a 100%); padding: 54px 0 58px; border-top: 1px solid rgba(255,255,255,.06); }
        .tig-in { max-width: 1160px; margin: 0 auto; padding: 0 40px; }
        .tig-panel { position: relative; border: 1px solid rgba(255,255,255,.08); border-radius: 18px; padding: 26px; background: rgba(255,255,255,.02); overflow: hidden; }
        .tig-panel::before { content: ''; position: absolute; left: 0; right: 0; top: 0; height: 2px; background: linear-gradient(90deg, transparent, #38bdf8, #d8b878, transparent); background-size: 200% 100%; animation: tig-flow 6s linear infinite; }
        .tig-k { display: inline-flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 800; letter-spacing: .18em; text-transform: uppercase; color: #94a3b8; }
        .tig-dot { width: 7px; height: 7px; border-radius: 50%; background: #38bdf8; box-shadow: 0 0 0 0 rgba(56,189,248,.6); animation: tig-pulse 2.4s ease-out infinite; }
        .tig-h { font-family: var(--font-playfair), serif; color: #f8fafc; font-size: clamp(21px, 2.6vw, 27px); line-height: 1.2; margin: 8px 0 20px; }
        .tig-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
        .tig-card { background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.08); border-radius: 10px; padding: 14px; transition: transform .25s ease, border-color .25s ease, background .25s ease; outline: none; }
        .tig-card:hover, .tig-card:focus-visible { transform: translateY(-3px); border-color: rgba(56,189,248,.45); background: rgba(56,189,248,.06); }
        .tig-card:focus-visible { box-shadow: 0 0 0 3px rgba(142,216,220,.6); }
        .tig-ic { font-size: 20px; margin-bottom: 6px; }
        .tig-l { font-size: 12px; color: #94a3b8; text-transform: uppercase; font-weight: 600; letter-spacing: .04em; }
        .tig-v { font-size: 15px; font-weight: 700; color: #38bdf8; margin-top: 2px; }
        .tig-t { font-size: 12.5px; line-height: 1.55; color: #cbd5e1; margin-top: 4px; }
        .tig-stats { margin-top: 16px; padding-top: 16px; border-top: 1px dashed rgba(255,255,255,.1); }
        .tig-st { font-size: 11px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; color: #d8b878; margin-bottom: 10px; }
        .tig-row { display: flex; flex-wrap: wrap; gap: 10px; margin: 0; padding: 0; }
        .tig-stat { flex: 1 1 130px; background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.07); border-radius: 10px; padding: 10px 12px; }
        .tig-stat dt { font-size: 11px; color: #94a3b8; text-transform: uppercase; font-weight: 600; letter-spacing: .04em; }
        .tig-stat dd { margin: 3px 0 0; font-size: 15px; font-weight: 700; color: #f1f5f9; }
        @keyframes tig-flow { from { background-position: 200% 0; } to { background-position: -200% 0; } }
        @keyframes tig-pulse { 0% { box-shadow: 0 0 0 0 rgba(56,189,248,.55); } 70% { box-shadow: 0 0 0 8px rgba(56,189,248,0); } 100% { box-shadow: 0 0 0 0 rgba(56,189,248,0); } }
        @media (prefers-reduced-motion: reduce) { .tig-panel::before, .tig-dot { animation: none; } .tig-card { transition: none; } }
        @media (max-width: 940px) { .tig-in { padding: 0 16px; } .tig-panel { padding: 20px 16px; } }
        @media (max-width: 700px) { .tig-grid { grid-template-columns: 1fr; } }
      `}</style>
      <div className="tig-in">
        <div className="tig-panel">
          <span className="tig-k"><span className="tig-dot" aria-hidden="true" />{info.kicker}</span>
          <h2 className="tig-h" id="tig-title">{info.title}</h2>
          <div className="tig-grid">
            {info.cards.map((card) => (
              <div key={card.label} className="tig-card" tabIndex={0}>
                <div className="tig-ic" aria-hidden="true">{card.icon}</div>
                <div className="tig-l">{card.label}</div>
                <div className="tig-v">{card.value}</div>
                <div className="tig-t">{card.text}</div>
              </div>
            ))}
          </div>
          <div className="tig-stats">
            <div className="tig-st">{info.statsTitle}</div>
            <dl className="tig-row">
              {items.map((item) => (
                <div key={item.label} className="tig-stat"><dt>{item.label}</dt><dd>{item.value}</dd></div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
