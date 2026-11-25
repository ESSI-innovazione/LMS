import Link from "next/link";
import { notFound } from "next/navigation";
import StopDecide from "@/components/StopDecide";
import { IconBack, IconPlay, IconReplay } from "@/components/Icons";
import { SEASONS, pad } from "@/lib/catalog";
import { getEpisodes } from "@/lib/data";
import { isReleased } from "@/lib/demo";
import { getScenario } from "@/lib/scenarios";

export const revalidate = 60;

const PHASES = ["Hook", "Scena", "Stop & Decide", "Rewind", "Regole d'oro", "Check"];

export default async function EpisodePage({ params }: { params: Promise<{ num: string }> }) {
  const { num } = await params;
  const n = Number.parseInt(num, 10);
  if (!Number.isInteger(n)) notFound();

  const { episodes } = await getEpisodes();
  const episode = episodes.find((e) => e.num === n);
  if (!episode) notFound();

  const season = SEASONS.find((s) => s.id === episode.season);
  const scenario = getScenario(episode.num);
  const node = scenario?.decisions[0] ?? null;
  const released = isReleased(episode);
  const currentPhase = node ? 2 : -1;

  return (
    <div className="player">
      <header className="player-head">
        <div style={{ display: "flex", alignItems: "center", gap: 16, minWidth: 0 }}>
          <Link href="/" className="back" aria-label="Torna alla home">
            <IconBack />
          </Link>
          <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
            <span className="player-kicker">
              {season?.title ?? "Stagione"} · Ep. {pad(episode.num)} · {episode.topic}
            </span>
            <span className="player-title">{episode.title}</span>
          </div>
        </div>
        <ol className="phases" aria-label="Fasi dell'episodio">
          {PHASES.map((p, i) => (
            <li
              key={p}
              className={i === currentPhase ? "current" : i < currentPhase ? "past" : undefined}
              aria-current={i === currentPhase ? "step" : undefined}
            >
              {p}
            </li>
          ))}
        </ol>
      </header>

      <main id="contenuto" className="player-main">
        {node ? (
          <StopDecide node={node} />
        ) : (
          <div className="frame">
            <div className="coming">
              <span className="eyebrow-accent">{released ? "Scenario in preparazione" : `In uscita · mese ${episode.month}`}</span>
              <h1 className="decide-q">{episode.title}</h1>
              <p className="hint" style={{ fontSize: 15 }}>
                {episode.area} · {episode.durationMin} min
                {episode.extra ? ` · Argomento extra ${episode.extra}` : ""}
              </p>
              <Link href="/episodi/06" className="btn btn-primary">
                Prova la demo dell&apos;Ep. 06
              </Link>
            </div>
          </div>
        )}

        <div className="controls">
          <div className="timeline">
            <span>{node?.timeAt ?? "0:00"}</span>
            <div
              className="track"
              role="progressbar"
              aria-label="Avanzamento episodio"
              aria-valuenow={node?.progressPct ?? 0}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div style={{ width: `${node?.progressPct ?? 0}%` }} />
            </div>
            <span>{scenario?.duration ?? `${episode.durationMin}:00`}</span>
          </div>
          <div className="row-between" style={{ gap: 12 }}>
            <div className="ctl-row">
              <button type="button" className="ctl-play" aria-label="Riproduci">
                <IconPlay size={18} />
              </button>
              <button type="button" className="ctl" aria-label="Indietro di 10 secondi" style={{ width: 44, padding: 0 }}>
                <IconReplay size={20} />
              </button>
            </div>
            <div className="ctl-row">
              <button type="button" className="ctl on" aria-pressed="true">
                Sottotitoli IT
              </button>
              <button type="button" className="ctl">
                Velocità 1x
              </button>
              <button type="button" className="ctl">
                Audiodescrizione
              </button>
              <button type="button" className="ctl">
                Solo audio
              </button>
              <button type="button" className="ctl">
                Trascrizione
              </button>
            </div>
          </div>
          <p className="player-note">
            Alla prima visione non si può andare oltre una decisione. Riprendi sempre dall&apos;ultima scelta.
          </p>
        </div>
      </main>
    </div>
  );
}
