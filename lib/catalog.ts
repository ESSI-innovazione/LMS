// Catalogue of the 24 episodes, from Relazione Tecnica ANAS, Cap. 4, table 4.1.1.
// Used as a fallback when Supabase is not configured or not seeded yet.

export type Profile = "operativo" | "amministrativo" | "management";

export const PROFILE_LABEL: Record<Profile, string> = {
  operativo: "operativo/territoriale",
  amministrativo: "amministrativo/acquisti",
  management: "management",
};

export interface Season {
  id: number;
  title: string;
  subtitle: string;
}

export interface Episode {
  num: number;
  season: number;
  month: number;
  title: string;
  topic: string;
  area: string;
  durationMin: number;
  extra: string | null;
  mandatoryFor: Profile[];
}

export const SEASONS: Season[] = [
  { id: 1, title: "Stagione 1", subtitle: "Riconoscere" },
  { id: 2, title: "Stagione 2", subtitle: "Reagire" },
];

type Raw = [number, string, string, string, number, string | null, Profile[]];

const RAW: Raw[] = [
  [1, "Il manipolatore gentile", "Social Engineering", "L'inganno ha molte voci", 8, null, []],
  [2, "Quell'e-mail che sembra vera", "Phishing", "L'inganno ha molte voci", 8, null, []],
  [3, "Allegati, link e mittenti", "Email Security", "L'inganno ha molte voci", 7, null, []],
  [4, "La chiave di casa", "Password Management", "Identità e accessi", 8, null, []],
  [5, "Sanno chi sei", "Spear Phishing", "L'inganno ha molte voci", 7, null, ["amministrativo"]],
  [6, "«Pronto, sono della Direzione»", "Vishing", "L'inganno ha molte voci", 7, null, ["amministrativo"]],
  [7, "L'ufficio in tasca", "Mobile Security", "Dispositivi e spazi di lavoro", 7, null, ["operativo"]],
  [8, "Ospiti indesiderati", "Malware", "Minacce software", 7, null, []],
  [9, "Il riscatto", "Ransomware", "Minacce software", 9, null, []],
  [10, "Navigare a vista", "Web Browsing", "Minacce software", 6, null, []],
  [11, "Casa, dolce ufficio", "Smart Working", "Lavoro ibrido e digitale", 7, null, []],
  [12, "Il valore di un dato", "Privacy e Data Protection", "Informazioni e dati", 10, null, []],
  [13, "Quello che posti resta", "Social Media", "Informazioni e dati", 7, null, []],
  [14, "Non credere ai tuoi occhi", "Deepfake e identità sintetiche", "Minacce emergenti", 8, "X1", ["management"]],
  [15, "Vero, falso, verosimile", "Fake News", "Informazioni e dati", 7, null, []],
  [16, "Chat, canali e file condivisi", "Social Collaboration", "Lavoro ibrido e digitale", 7, null, []],
  [17, "Il collega artificiale", "IA generativa: uso sicuro", "Minacce emergenti", 8, "X2", []],
  [18, "Oggetti che parlano troppo", "IoT Device", "Dispositivi e spazi di lavoro", 7, null, ["operativo"]],
  [19, "Quando il cyber scende in strada", "Sicurezza OT e infrastrutture critiche", "Contesto ANAS", 9, "X3", ["operativo"]],
  [20, "La chiavetta nel parcheggio", "USB Storage", "Dispositivi e spazi di lavoro", 5, null, []],
  [21, "Il fornitore che non era lui", "Business Email Compromise", "Contesto ANAS", 8, "X4", ["amministrativo"]],
  [22, "Acquisti sicuri", "eCommerce", "Lavoro ibrido e digitale", 6, null, []],
  [23, "Scrivania pulita, dati al sicuro", "Clean Desk", "Dispositivi e spazi di lavoro", 5, null, []],
  [24, "I primi 15 minuti", "Incident reporting e risposta", "Contesto ANAS", 9, "X5", ["management"]],
];

export const EPISODES: Episode[] = RAW.map(([num, title, topic, area, durationMin, extra, mandatoryFor]) => ({
  num,
  season: num <= 12 ? 1 : 2,
  month: num,
  title,
  topic,
  area,
  durationMin,
  extra,
  mandatoryFor,
}));

export function pad(n: number): string {
  return n.toString().padStart(2, "0");
}
