import type { Episode, Profile } from "./catalog";

// Sample learner state until login and real progress exist (step 2).
export const DEMO_LEARNER = {
  name: "[NOME]",
  initials: "NC",
  structure: "[STRUTTURA TERRITORIALE]",
  profile: "operativo" as Profile,
  currentMonth: 7,
  completed: [1, 2, 3, 4, 5, 6],
  inProgress: 7,
  resumeLabel: "Riprendi dalla decisione 2",
  recapEpisode: 5,
  badges: 3,
  assessmentDone: true,
};

export type EpisodeStatus = "done" | "now" | "next";

export const STATUS_LABEL: Record<EpisodeStatus, string> = {
  done: "Completato",
  now: "In corso",
  next: "In uscita",
};

export function statusOf(ep: Episode): EpisodeStatus {
  if (DEMO_LEARNER.completed.includes(ep.num)) return "done";
  if (ep.num === DEMO_LEARNER.inProgress) return "now";
  return "next";
}

export function isReleased(ep: Episode): boolean {
  return ep.month <= DEMO_LEARNER.currentMonth;
}
