import { cn } from "@/lib/utils";

const TONES = [
  { bg: "bg-brand", num: "text-white", lane: "bg-brand-orange" },
  { bg: "bg-brand-red", num: "text-white", lane: "bg-brand-orange" },
  { bg: "bg-brand-orange", num: "text-brand", lane: "bg-brand" },
  { bg: "bg-brand-600", num: "text-white", lane: "bg-brand-orange" },
];

export default function EpisodeThumb({
  num,
  numLabel,
  badge,
  muted = false,
  className,
}: {
  num: number;
  numLabel: string;
  badge?: string;
  muted?: boolean;
  className?: string;
}) {
  const tone = TONES[num % TONES.length] ?? TONES[0];
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl",
        muted ? "bg-slate-200" : tone.bg,
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-3 left-4 font-display text-5xl font-bold tracking-tight",
          muted ? "text-slate-500" : tone.num,
        )}
      >
        {numLabel}
      </span>
      <div aria-hidden="true" className="absolute inset-x-4 bottom-6 flex gap-2 opacity-80">
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className={cn("h-1 flex-1 rounded-full", muted ? "bg-slate-400" : tone.lane)} />
        ))}
      </div>
      {badge && (
        <span className="absolute right-3 bottom-3 rounded-md bg-white px-2 py-0.5 text-xs font-semibold text-brand shadow-sm">
          {badge}
        </span>
      )}
    </div>
  );
}
