"use client";

import Link from "next/link";
import { useState } from "react";
import type { Season } from "@/lib/catalog";

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

export default function EpisodeGrid({ seasons, episodes }: { seasons: Season[]; episodes: EpisodeTile[] }) {
  const [seasonId, setSeasonId] = useState<number>(seasons[0]?.id ?? 1);
  const season = seasons.find((s) => s.id === seasonId) ?? seasons[0];
  const visible = episodes.filter((e) => e.season === seasonId);

  return (
    <section id="episodi" aria-labelledby="season-title" className="stack-16">
      <div className="row-between">
        <h2 id="season-title" className="h-section">
          {season ? `${season.title} · «${season.subtitle}»` : "Episodi"}
        </h2>
        <div role="group" aria-label="Stagione" className="seg">
          {seasons.map((s) => (
            <button
              key={s.id}
              type="button"
              aria-pressed={s.id === seasonId}
              className={s.id === seasonId ? "seg-btn on" : "seg-btn"}
              onClick={() => setSeasonId(s.id)}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>
      <div className="ep-grid">
        {visible.map((e) => (
          <Link key={e.num} href={`/episodi/${e.numLabel}`} className="ep-tile">
            <div className={`ep-band band-${e.status}`}>
              <span className="ep-num">{e.numLabel}</span>
              <span className={`pill pill-${e.status} ep-pill`}>{e.statusLabel}</span>
            </div>
            <div className="ep-body">
              <span className="ep-title">{e.title}</span>
              <span className="muted-sm">
                {e.topic} · {e.durationMin} min{e.extra ? ` · Extra ${e.extra}` : ""}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
