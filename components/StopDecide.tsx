"use client";

import { useCallback, useEffect, useState } from "react";
import type { DecisionNode } from "@/lib/scenarios/types";

export default function StopDecide({ node }: { node: DecisionNode }) {
  const [picked, setPicked] = useState<string | null>(null);
  const chosen = node.options.find((o) => o.id === picked) ?? null;

  const pickByIndex = useCallback(
    (i: number) => {
      const opt = node.options[i];
      if (opt) setPicked(opt.id);
    },
    [node.options],
  );

  // Keys 1 to 3 choose an option, as the tender requires keyboard operation.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      const n = Number(e.key);
      if (Number.isInteger(n) && n >= 1 && n <= node.options.length) pickByIndex(n - 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [node.options.length, pickByIndex]);

  return (
    <div className="frame">
      <span className="frame-label">[{node.frameLabel}]</span>
      <div className="frame-overlay">
        <span className="eyebrow-accent">Stop &amp; Decide</span>
        <h1 id={`q-${node.id}`} className="decide-q">
          {node.question}
        </h1>
        <div role="group" aria-labelledby={`q-${node.id}`} className="options">
          {node.options.map((o, i) => {
            const sel = o.id === picked;
            const cls = sel ? (o.correct ? "option sel-ok" : "option sel-ko") : "option";
            return (
              <button key={o.id} type="button" className={cls} aria-pressed={sel} onClick={() => setPicked(o.id)}>
                <span className="option-key" aria-hidden="true">
                  {i + 1}
                </span>
                <span>{o.label}</span>
              </button>
            );
          })}
        </div>
        <div aria-live="polite" className="feedback-wrap">
          {chosen ? (
            <p className={chosen.correct ? "feedback ok" : "feedback ko"}>{chosen.feedback}</p>
          ) : (
            <p className="hint">Scegli con un clic o con i tasti 1, 2, 3 · Nessun limite di tempo</p>
          )}
        </div>
      </div>
    </div>
  );
}
