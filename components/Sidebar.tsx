import Link from "next/link";
import {
  Award,
  Clapperboard,
  ClipboardCheck,
  House,
  IdCard,
  LifeBuoy,
  LogOut,
  RotateCcw,
  Settings,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string; Icon: LucideIcon };

const NAV: NavItem[] = [
  { href: "/", label: "Home", Icon: House },
  { href: "/#episodi", label: "Episodi", Icon: Clapperboard },
  { href: "/#percorso", label: "Il mio percorso", Icon: ClipboardCheck },
  { href: "/#statistiche", label: "Cyber Card", Icon: IdCard },
  { href: "/#statistiche", label: "Badge", Icon: Award },
  { href: "/#consigliati", label: "Ripassi", Icon: RotateCcw },
  { href: "/#aree", label: "Segnala un incidente", Icon: ShieldAlert },
];

const BOTTOM: NavItem[] = [
  { href: "/#", label: "Impostazioni", Icon: Settings },
  { href: "/#", label: "Assistenza e accessibilità", Icon: LifeBuoy },
  { href: "/login", label: "Esci", Icon: LogOut },
];

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const { href, label, Icon } = item;
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex min-h-11 shrink-0 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors",
        active ? "bg-brand text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-brand",
      )}
    >
      <Icon size={18} aria-hidden="true" className={active ? "text-brand-orange" : undefined} />
      <span className="whitespace-nowrap">{label}</span>
    </Link>
  );
}

export default function Sidebar({ active = "Home" }: { active?: string }) {
  return (
    <aside className="border-b border-border bg-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col lg:border-r lg:border-b-0">
      <div className="flex items-center justify-between gap-3 px-5 pt-5 pb-3 lg:block lg:px-6 lg:pt-7 lg:pb-6">
        <Link href="/" className="block" aria-label="Corsia Sicura, home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/timevision-logo.svg" alt="Time Vision" className="h-8 w-auto" />
        </Link>
        <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase lg:mt-3">
          Corsia Sicura · <span className="text-brand-orange-ink">Cyber Academy</span>
        </p>
      </div>

      <nav aria-label="Menu principale" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:px-4">
        {NAV.map((item) => (
          <NavLink key={item.label} item={item} active={item.label === active} />
        ))}
      </nav>

      <div className="mt-auto hidden flex-col gap-1 border-t border-border px-4 py-4 lg:flex">
        {BOTTOM.map((item) => (
          <NavLink key={item.label} item={item} active={false} />
        ))}
        <div className="mt-3 flex h-12 items-center justify-center rounded-xl border border-dashed border-slate-300 text-xs text-slate-500">
          [LOGO CLIENTE]
        </div>
      </div>
    </aside>
  );
}
