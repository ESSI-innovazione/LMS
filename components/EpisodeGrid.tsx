"use client";

import Link from "next/link";
import { useState } from "react";
import type { Season } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import EpisodeThumb from "./EpisodeThumb";

export interface EpisodeTile {
  num: number;
  numLabel: string;
  season: number;
  title: string;
  topic: string;
  durationMin: number;
  status: "done" | "now" | "next";
  statusLabel: string;
  extra: string | null;
}

const STATUS_CLASS: Record<EpisodeTile["status"], string> = {
  done: "bg-emerald-50 text-emerald-800",
  now: "bg-brand-orange-50 text-brand-orange-ink",
  next: "bg-slate-100 text-slate-600",
};

export default function EpisodeGrid({ seasons, episodes }: { seasons: Season[]; episodes: EpisodeTile[] }) {
  const [seasonId, setSeasonId] = useState<number>(seasons[0]?.id ?? 1);
  const season = seasons.find((s) => s.id === seasonId) ?? seasons[0];
  const visible = episodes.filter((e) => e.season === seasonId);

  return (
    <section id="episodi" aria-labelledby="season-title" className="rounded-2xl border border-border bg-white p-5 lg:p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="season-title" className="font-display text-lg font-bold text-brand">
            Tutti gli episodi
          </h2>
          <p className="text-sm text-muted-foreground">
            {season ? `${season.title} · «${season.subtitle}» · ${visible.length} episodi` : ""}
          </p>
        </div>
        <div role="group" aria-label="Stagione" className="flex gap-2">
          {seasons.map((s) => (
            <button
              key={s.id}
              type="button"
              aria-pressed={s.id === seasonId}
              onClick={() => setSeasonId(s.id)}
              className={cn(
                "min-h-10 rounded-xl px-4 text-sm font-semibold transition-colors",
                s.id === seasonId ? "bg-brand text-white" : "border border-border bg-white text-brand hover:bg-slate-50",
              )}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
        {visible.map((e) => (
          <Link
            key={e.num}
            href={`/episodi/${e.numLabel}`}
            className="group flex flex-col rounded-2xl border border-border p-3 transition-colors hover:border-brand/40"
          >
            <EpisodeThumb num={e.num} numLabel={e.numLabel} badge={`${e.durationMin} min`} muted={e.status === "next"} className="h-28" />
            <div className="flex flex-1 flex-col gap-1 px-1 pt-3">
              <span className="text-sm leading-snug font-semibold text-brand group-hover:underline">{e.title}</span>
              <span className="text-xs text-muted-foreground">
                {e.topic}
                {e.extra ? ` · Extra ${e.extra}` : ""}
              </span>
              <span className={cn("mt-2 self-start rounded-md px-2 py-0.5 text-xs font-semibold", STATUS_CLASS[e.status])}>
                {e.statusLabel}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
