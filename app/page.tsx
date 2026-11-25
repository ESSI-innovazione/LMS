import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import EpisodeGrid, { type EpisodeTile } from "@/components/EpisodeGrid";
import { IconBell, IconCard, IconCheck, IconHeadphones, IconPlay, IconReplay } from "@/components/Icons";
import { PROFILE_LABEL, SEASONS, pad } from "@/lib/catalog";
import { getEpisodes } from "@/lib/data";
import { DEMO_LEARNER, STATUS_LABEL, statusOf } from "@/lib/demo";

export const revalidate = 60;

export default async function HomePage() {
  const { episodes, source } = await getEpisodes();
  const learner = DEMO_LEARNER;

  const current = episodes.find((e) => e.num === learner.inProgress) ?? episodes[0];
  const recap = episodes.find((e) => e.num === learner.recapEpisode);
  const mandatory = episodes.filter((e) => e.mandatoryFor.includes(learner.profile));
  const done = episodes.filter((e) => learner.completed.includes(e.num));
  const season1 = episodes.filter((e) => e.season === 1);
  const season1Done = season1.filter((e) => learner.completed.includes(e.num)).length;
  const extrasDone = done.filter((e) => e.extra).length;
  const extrasTotal = episodes.filter((e) => e.extra).length;

  const tiles: EpisodeTile[] = episodes.map((e) => {
    const status = statusOf(e);
    return {
      num: e.num,
      numLabel: pad(e.num),
      season: e.season,
      title: e.title,
      topic: e.topic,
      durationMin: e.durationMin,
      status,
      statusLabel: STATUS_LABEL[status],
      extra: e.extra,
    };
  });

  return (
    <div className="shell">
      <Sidebar active="Home" />
      <main id="contenuto" className="main">
        <div className="container">
          <header className="row-between">
            <div className="stack-16" style={{ gap: 6 }}>
              <h1 className="h-page">Buongiorno, {learner.name}</h1>
              <p className="muted">
                Profilo {PROFILE_LABEL[learner.profile]} · {learner.structure}
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button type="button" className="icon-btn" aria-label="Notifiche, 2 nuove">
                <IconBell />
                <span className="dot" aria-hidden="true" />
              </button>
              <div className="avatar" aria-hidden="true">
                {learner.initials}
              </div>
            </div>
          </header>

          <div className="row-flex">
            {current && (
              <section className="hero" aria-labelledby="next-ep">
                <div className="thumb">
                  <span className="thumb-label">[FOTOGRAMMA EPISODIO]</span>
                  <span className="thumb-num" aria-hidden="true">
                    {pad(current.num)}
                  </span>
                  <div className="play" aria-hidden="true">
                    <IconPlay size={26} />
                  </div>
                  <div className="thumb-progress" aria-hidden="true">
                    <div style={{ width: "38%" }} />
                  </div>
                </div>
                <div className="hero-body">
                  <span className="eyebrow">Episodio del mese · Mese {current.month}</span>
                  <h2 id="next-ep" className="hero-title">
                    {current.title}
                  </h2>
                  <div className="chips">
                    <span className="tag pill-soft">{current.topic}</span>
                    {current.mandatoryFor.includes(learner.profile) && (
                      <span className="tag pill-amber" style={{ fontWeight: 600 }}>
                        Obbligatorio per il tuo profilo
                      </span>
                    )}
                  </div>
                  <p className="muted" style={{ lineHeight: 1.5 }}>
                    Ti sei fermato alla seconda decisione.
                  </p>
                  <p className="muted-sm" style={{ margin: 0 }}>
                    {current.durationMin} min · Sottotitoli IT · Trascrizione · Versione solo audio
                  </p>
                  <div className="chips" style={{ gap: 10, marginTop: 4 }}>
                    <Link href={`/episodi/${pad(current.num)}`} className="btn btn-primary">
                      {learner.resumeLabel}
                    </Link>
                    <Link href={`/episodi/${pad(current.num)}?audio=1`} className="btn">
                      <IconHeadphones size={18} />
                      Solo audio
                    </Link>
                  </div>
                </div>
              </section>
            )}

            <section id="percorso" className="card season-card" aria-labelledby="seasons">
              <h2 id="seasons" className="h-card">
                Il tuo percorso
              </h2>
              <div className="stack-16" style={{ gap: 10 }}>
                <div className="row-between" style={{ gap: 8 }}>
                  <span style={{ fontWeight: 600, fontSize: 15 }}>Stagione 1 · «Riconoscere»</span>
                  <span className="muted-sm">
                    {season1Done} di {season1.length}
                  </span>
                </div>
                <div
                  className="bar"
                  role="progressbar"
                  aria-label="Stagione 1"
                  aria-valuenow={season1Done}
                  aria-valuemin={0}
                  aria-valuemax={season1.length}
                >
                  <div style={{ width: `${season1.length ? (season1Done / season1.length) * 100 : 0}%` }} />
                </div>
                <span className="muted-sm">Test finale dal mese 12 · soglia 80% · tentativi illimitati</span>
              </div>
              <div className="stack-16" style={{ gap: 10 }}>
                <div className="row-between" style={{ gap: 8 }}>
                  <span style={{ fontWeight: 600, fontSize: 15 }}>Stagione 2 · «Reagire»</span>
                  <span className="muted-sm">dal mese 13</span>
                </div>
                <div className="bar locked" aria-hidden="true" />
              </div>
              {learner.assessmentDone && (
                <div className="note-box">
                  <IconCheck size={22} />
                  Assessment iniziale completato
                </div>
              )}
            </section>
          </div>

          <div className="grid-3">
            <section className="card" aria-labelledby="mandatory">
              <h2 id="mandatory" className="h-card">
                Obbligatori per il tuo profilo
              </h2>
              {mandatory.map((e) => {
                const status = statusOf(e);
                return (
                  <Link key={e.num} href={`/episodi/${pad(e.num)}`} className="list-item">
                    <span className="num-chip">{pad(e.num)}</span>
                    <span className="list-text">
                      <span className="list-title">{e.title}</span>
                      <span className="muted-sm">
                        {e.topic} · mese {e.month}
                      </span>
                    </span>
                    <span className={`pill pill-${status}`}>{STATUS_LABEL[status]}</span>
                  </Link>
                );
              })}
            </section>

            {recap && (
              <section className="card" aria-labelledby="recap">
                <h2 id="recap" className="h-card">
                  Da ripassare
                </h2>
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div className="recap-icon" aria-hidden="true">
                    <IconReplay size={24} />
                  </div>
                  <div className="stack-16" style={{ gap: 4 }}>
                    <span className="list-title">
                      Ripasso di 90 secondi · Ep. {pad(recap.num)} «{recap.title}»
                    </span>
                    <span className="muted-sm" style={{ fontSize: 14, lineHeight: 1.5 }}>
                      Una risposta del Check non era corretta. Rivedi i red flag: {recap.topic}.
                    </span>
                  </div>
                </div>
                <Link href={`/episodi/${pad(recap.num)}?ripasso=1`} className="btn" style={{ alignSelf: "flex-start" }}>
                  Guarda il ripasso
                </Link>
              </section>
            )}

            <section id="cyber-card" className="card" aria-labelledby="cards">
              <div className="row-between">
                <h2 id="cards" className="h-card">
                  Cyber Card e badge
                </h2>
              </div>
              <div className="chips">
                {done.map((e) => (
                  <span key={e.num} className="chip">
                    <IconCard size={14} />
                    {e.topic}
                  </span>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: "auto" }}>
                <div className="stat">
                  <span className="stat-num">{learner.badges}</span>
                  <span className="muted-sm">Badge ottenuti</span>
                </div>
                <div className="stat dashed">
                  <span className="stat-num" style={{ color: "var(--muted)" }}>
                    {extrasDone} / {extrasTotal}
                  </span>
                  <span className="muted-sm">Cyber Specialist</span>
                </div>
              </div>
            </section>
          </div>

          <EpisodeGrid seasons={SEASONS} episodes={tiles} />

          <footer className="footer">
            <span>Contenuti conformi WCAG 2.1 AA · Sottotitoli e trascrizioni su ogni episodio</span>
            <span>
              Hai notato un&apos;anomalia? <a href="#" style={{ fontWeight: 600 }}>Segnala un incidente</a>
            </span>
            <span>Catalogo: {source === "supabase" ? "Supabase" : "dati statici (Supabase non collegato)"}</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
