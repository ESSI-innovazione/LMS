import Link from "next/link";
import { IconAccess, IconBadge, IconCard, IconCheck, IconHome, IconRoad, IconUser, IconVideo } from "./Icons";

const NAV = [
  { href: "/", label: "Home", Icon: IconHome },
  { href: "/#episodi", label: "Episodi", Icon: IconVideo },
  { href: "/#cyber-card", label: "Cyber Card", Icon: IconCard },
  { href: "/#cyber-card", label: "Badge", Icon: IconBadge },
  { href: "/#percorso", label: "Test e attestati", Icon: IconCheck },
  { href: "/#", label: "Il mio profilo", Icon: IconUser },
];

export default function Sidebar({ active = "Home" }: { active?: string }) {
  return (
    <nav className="sidebar" aria-label="Menu principale">
      <div className="brand">
        <div className="brand-mark">
          <IconRoad size={22} />
        </div>
        <div className="brand-text">
          <span className="brand-name">Corsia Sicura</span>
          <span className="brand-sub">Cyber Academy</span>
        </div>
      </div>
      <div className="lane" aria-hidden="true" />
      <div className="nav-list">
        {NAV.map(({ href, label, Icon }) => (
          <Link
            key={label}
            href={href}
            className={label === active ? "nav-item active" : "nav-item"}
            aria-current={label === active ? "page" : undefined}
          >
            <Icon />
            {label}
          </Link>
        ))}
      </div>
      <div className="nav-bottom">
        <Link href="/#" className="nav-item outlined">
          <IconAccess />
          Accessibilità
        </Link>
        <div className="logo-slot">[LOGO CLIENTE]</div>
      </div>
    </nav>
  );
}
