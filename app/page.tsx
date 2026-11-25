import Link from "next/link";
import {
  Award,
  Bug,
  CircleCheck,
  Clapperboard,
  Database,
  Factory,
  Globe,
  IdCard,
  KeyRound,
  MessagesSquare,
  Play,
  Smartphone,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import EpisodeGrid, { type EpisodeTile } from "@/components/EpisodeGrid";
import EpisodeThumb from "@/components/EpisodeThumb";
import { PROFILE_LABEL, SEASONS, pad, type Episode } from "@/lib/catalog";
import { getEpisodes } from "@/lib/data";
import { DEMO_LEARNER, STATUS_LABEL, statusOf, type EpisodeStatus } from "@/lib/demo";
import { cn } from "@/lib/utils";

export const revalidate = 60;

const AREA_ICON: Record<string, LucideIcon> = {
  "L'inganno ha molte voci": MessagesSquare,
  "Identità e accessi": KeyRound,
  "Dispositivi e spazi di lavoro": Smartphone,
  "Minacce software": Bug,
  "Lavoro ibrido e digitale": Globe,
  "Informazioni e dati": Database,
  "Minacce emergenti": Sparkles,
  "Contesto ANAS": Factory,
};

const STATUS_CLASS: Record<EpisodeStatus, string> = {
  done: "bg-emerald-50 text-emerald-800",
  now: "bg-brand-orange-50 text-brand-orange-ink",
  next: "bg-slate-100 text-slate-600",
};

function progressOf(ep: Episode): number {
  const s = statusOf(ep);
  if (s === "done") return 100;
  if (s === "now") return 38; // sample: stopped at decision 2
  return 0;
}

export default async function HomePage() {
  const { episodes, source } = await getEpisodes();
  const learner = DEMO_LEARNER;

  const done = episodes.filter((e) => learner.completed.includes(e.num));
  const current = episodes.find((e) => e.num === learner.inProgress);
  const mandatory = episodes.filter((e) => e.mandatoryFor.includes(learner.profile));

  // "Il mio percorso" table: current episode, last two completed, then upcoming mandatory ones.
  const tableNums = Array.from(
    new Set([learner.inProgress, ...learner.completed.slice(-2).reverse(), ...mandatory.map((e) => e.num)]),
  ).slice(0, 5);
  const tableRows = tableNums
    .map((n) => episodes.find((e) => e.num === n))
    .filter((e): e is Episode => Boolean(e));

  // Recommended: current, next releases, then mandatory not yet seen.
  const recommendedNums = Array.from(
    new Set([learner.inProgress, learner.inProgress + 1, ...mandatory.filter((e) => statusOf(e) === "next").map((e) => e.num), learner.recapEpisode]),
  ).slice(0, 4);
  const recommended = recommendedNums
    .map((n) => episodes.find((e) => e.num === n))
    .filter((e): e is Episode => Boolean(e));

  const areas = Array.from(new Set(episodes.map((e) => e.area))).map((area) => ({
    area,
    count: episodes.filter((e) => e.area === area).length,
    Icon: AREA_ICON[area] ?? Sparkles,
  }));

  const stats: { value: string; label: string; Icon: LucideIcon; tile: string }[] = [
    { value: `${episodes.length} episodi`, label: "In catalogo", Icon: Clapperboard, tile: "bg-brand text-white" },
    { value: `${done.length} completati`, label: `Mese ${learner.currentMonth} di 24`, Icon: CircleCheck, tile: "bg-brand-orange text-brand" },
    { value: `${done.length} Cyber Card`, label: "Ottenute", Icon: IdCard, tile: "bg-brand-red text-white" },
    { value: `${learner.badges} badge`, label: "Guadagnati", Icon: Award, tile: "bg-brand-600 text-white" },
  ];

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
    <div className="flex min-h-screen flex-col lg:flex-row">
      <Sidebar active="Home" />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          name={learner.name}
          initials={learner.initials}
          profileLabel={`Profilo ${PROFILE_LABEL[learner.profile]}`}
          subtitle={current ? `Ti aspetta l'episodio del mese: «${current.title}».` : "Continua il tuo percorso."}
        />

        <main id="contenuto" className="flex flex-col gap-6 p-5 lg:p-8">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
            <section id="percorso" aria-labelledby="percorso-title" className="min-w-0 rounded-2xl border border-border bg-white p-5 lg:p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 id="percorso-title" className="font-display text-lg font-bold text-brand">
                  Il mio percorso
                </h2>
                <span className="text-sm text-muted-foreground">
                  {learner.structure} · profilo {PROFILE_LABEL[learner.profile]}
                </span>
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[680px] text-left text-sm">
                  <thead>
                    <tr className="text-xs font-semibold text-slate-500">
                      <th scope="col" className="pb-3 font-semibold">Episodio</th>
                      <th scope="col" className="pb-3 font-semibold">Argomento</th>
                      <th scope="col" className="pb-3 font-semibold">Avanzamento</th>
                      <th scope="col" className="pb-3 font-semibold">Priorità</th>
                      <th scope="col" className="pb-3 font-semibold">Rilascio</th>
                      <th scope="col" className="pb-3 text-right font-semibold">Azione</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableRows.map((e) => {
                      const pct = progressOf(e);
                      const isMandatory = e.mandatoryFor.includes(learner.profile);
                      return (
                        <tr key={e.num} className="border-t border-border">
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-3">
                              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 font-display text-sm font-bold text-brand">
                                {pad(e.num)}
                              </span>
                              <span className="font-medium text-brand">{e.title}</span>
                            </div>
                          </td>
                          <td className="py-3 pr-4 text-slate-600">{e.topic}</td>
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-2">
                              <div
                                className="h-2 w-28 overflow-hidden rounded-full bg-slate-100"
                                role="progressbar"
                                aria-label={`Avanzamento ${e.title}`}
                                aria-valuenow={pct}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              >
                                <div className={cn("h-full rounded-full", pct === 100 ? "bg-brand" : "bg-brand-orange")} style={{ width: `${pct}%` }} />
                              </div>
                              <span className="w-10 text-xs font-medium text-slate-600 tabular-nums">{pct}%</span>
                            </div>
                          </td>
                          <td className="py-3 pr-4">
                            <span
                              className={cn(
                                "rounded-md px-2 py-1 text-xs font-semibold",
                                isMandatory ? "bg-brand-red-50 text-brand-red" : "bg-slate-100 text-slate-600",
                              )}
                            >
                              {isMandatory ? "Obbligatorio" : "Consigliato"}
                            </span>
                          </td>
                          <td className="py-3 pr-4 text-slate-600">Mese {e.month}</td>
                          <td className="py-3 text-right">
                            <Link
                              href={`/episodi/${pad(e.num)}`}
                              aria-label={`Apri ${e.title}`}
                              className="inline-flex size-9 items-center justify-center rounded-lg text-brand hover:bg-brand-50"
                            >
                              <Play size={16} aria-hidden="true" fill="currentColor" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            <section id="statistiche" aria-label="I tuoi numeri" className="grid grid-cols-2 gap-3 xl:grid-cols-1">
              {stats.map(({ value, label, Icon, tile }) => (
                <div key={value} className="flex items-center gap-3 rounded-2xl border border-border bg-white p-4">
                  <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl", tile)}>
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <div className="min-w-0 leading-tight">
                    <p className="font-display text-base font-bold text-brand">{value}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                </div>
              ))}
            </section>
          </div>

          <section id="consigliati" aria-labelledby="consigliati-title" className="rounded-2xl border border-border bg-white p-5 lg:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 id="consigliati-title" className="font-display text-lg font-bold text-brand">
                  Consigliati per te
                </h2>
                <p className="text-sm text-muted-foreground">In base al tuo profilo e alle tue ultime risposte.</p>
              </div>
              <Link href="/#episodi" className="inline-flex min-h-10 items-center rounded-xl bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-600">
                Vedi tutti
              </Link>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {recommended.map((e, i) => {
                const status = statusOf(e);
                const featured = i === 0;
                const isMandatory = e.mandatoryFor.includes(learner.profile);
                const isRecap = e.num === learner.recapEpisode && status === "done";
                const cta = status === "now" ? "Riprendi" : status === "done" ? (isRecap ? "Ripasso di 90 secondi" : "Rivedi") : `Disponibile dal mese ${e.month}`;
                return (
                  <article
                    key={e.num}
                    className={cn(
                      "flex flex-col rounded-2xl border p-3",
                      featured ? "border-brand-orange bg-brand-orange-50/40 ring-1 ring-brand-orange" : "border-border",
                    )}
                  >
                    <EpisodeThumb num={e.num} numLabel={pad(e.num)} badge={`${e.durationMin} min`} className="h-36" />
                    <div className="flex flex-1 flex-col gap-2 px-1 pt-3">
                      <h3 className="text-sm leading-snug font-bold text-brand">
                        Ep. {pad(e.num)} · {e.title}
                      </h3>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {e.area}. {SEASONS.find((s) => s.id === e.season)?.title} «{SEASONS.find((s) => s.id === e.season)?.subtitle}».
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="rounded-md border border-border px-2 py-0.5 text-xs text-slate-600">{e.topic}</span>
                        <span className={cn("rounded-md px-2 py-0.5 text-xs font-semibold", STATUS_CLASS[status])}>{STATUS_LABEL[status]}</span>
                        {isMandatory && <span className="rounded-md bg-brand-red-50 px-2 py-0.5 text-xs font-semibold text-brand-red">Obbligatorio</span>}
                      </div>
                      <div className="mt-auto pt-2">
                        {status === "next" ? (
                          <span className="flex min-h-10 w-full items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-600">
                            {cta}
                          </span>
                        ) : (
                          <Link
                            href={`/episodi/${pad(e.num)}${isRecap ? "?ripasso=1" : ""}`}
                            className={cn(
                              "flex min-h-10 w-full items-center justify-center rounded-xl text-sm font-semibold",
                              featured ? "bg-brand-orange text-brand hover:brightness-95" : "bg-brand-50 text-brand hover:bg-brand hover:text-white",
                            )}
                          >
                            {cta}
                          </Link>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section id="aree" aria-labelledby="aree-title" className="rounded-2xl border border-border bg-white p-5 lg:p-6">
            <h2 id="aree-title" className="font-display text-lg font-bold text-brand">
              Aree tematiche
            </h2>
            <p className="text-sm text-muted-foreground">I 24 episodi coprono 20 argomenti obbligatori e 5 argomenti extra.</p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {areas.map(({ area, count, Icon }, i) => (
                <li key={area} className="flex items-center gap-3 rounded-xl border border-border p-3">
                  <span
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-lg",
                      ["bg-brand text-white", "bg-brand-orange text-brand", "bg-brand-red text-white", "bg-brand-600 text-white"][i % 4],
                    )}
                  >
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <div className="min-w-0 leading-tight">
                    <p className="text-sm font-semibold text-brand">{area}</p>
                    <p className="text-xs text-muted-foreground">{count} episodi</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <EpisodeGrid seasons={SEASONS} episodes={tiles} />

          <footer className="flex flex-wrap justify-between gap-3 border-t border-border pt-4 text-xs text-muted-foreground">
            <span>Contenuti conformi WCAG 2.1 AA · Sottotitoli e trascrizioni su ogni episodio</span>
            <span>Catalogo: {source === "supabase" ? "Supabase" : "dati statici (Supabase non collegato)"}</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
