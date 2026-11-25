import type { Scenario } from "./types";

// Episode 06, from the storyboard in Cap. 4, § 4.1.4.
const ep06: Scenario = {
  episodeNum: 6,
  duration: "6:30",
  decisions: [
    {
      id: "ep06-d1",
      question: "Tu cosa faresti al posto di Marta?",
      frameLabel: "Fotogramma congelato – Marta alla scrivania, e-mail «di conferma» sullo schermo",
      timeAt: "2:20",
      progressPct: 36,
      options: [
        {
          id: "A",
          label: "Procedo: l'emergenza è reale.",
          correct: false,
          points: 0,
          feedback: "La conferma è arrivata dallo stesso canale dell'attaccante: non vale.",
          riskTag: "salta la verifica",
        },
        {
          id: "B",
          label: "Rispondo all'e-mail chiedendo conferma.",
          correct: false,
          points: 1,
          feedback: "La conferma è arrivata dallo stesso canale dell'attaccante: non vale.",
          riskTag: "verifica sullo stesso canale",
        },
        {
          id: "C",
          label: "Chiudo e richiamo l'ing. Ferri dalla rubrica ufficiale.",
          correct: true,
          points: 2,
          feedback: "Scelta corretta: canale indipendente.",
          riskTag: null,
        },
      ],
    },
  ],
};

const SCENARIOS: Record<number, Scenario> = { 6: ep06 };

export function getScenario(episodeNum: number): Scenario | null {
  return SCENARIOS[episodeNum] ?? null;
}
