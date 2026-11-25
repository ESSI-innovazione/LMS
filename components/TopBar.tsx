import { Bell, Search } from "lucide-react";

export default function TopBar({
  name,
  initials,
  profileLabel,
  subtitle,
}: {
  name: string;
  initials: string;
  profileLabel: string;
  subtitle: string;
}) {
  return (
    <header className="flex flex-wrap items-center gap-4 border-b border-border bg-white px-5 py-4 lg:px-8">
      <div className="min-w-0 flex-1">
        <h1 className="font-display text-xl font-bold tracking-tight text-brand lg:text-2xl">Bentornato, {name}!</h1>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <form role="search" className="order-3 w-full sm:order-none sm:w-auto" action="/" method="get">
        <label htmlFor="cerca" className="sr-only">
          Cerca episodi
        </label>
        <div className="relative">
          <Search size={16} aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-500" />
          <input
            id="cerca"
            name="q"
            type="search"
            placeholder="Cerca episodi"
            className="h-11 w-full rounded-xl border border-input bg-slate-50 pr-3 pl-9 text-sm placeholder:text-slate-500 focus:bg-white sm:w-64"
          />
        </div>
      </form>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Notifiche, 2 nuove"
          className="relative flex size-11 items-center justify-center rounded-xl border border-border bg-white text-brand hover:bg-slate-50"
        >
          <Bell size={18} aria-hidden="true" />
          <span aria-hidden="true" className="absolute top-2.5 right-2.5 size-2.5 rounded-full border-2 border-white bg-brand-orange" />
        </button>
        <div className="flex items-center gap-3 rounded-xl pr-1">
          <div aria-hidden="true" className="flex size-11 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
            {initials}
          </div>
          <div className="hidden leading-tight md:block">
            <p className="text-sm font-semibold text-brand">{name}</p>
            <p className="text-xs text-muted-foreground">{profileLabel}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
