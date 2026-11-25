export interface DecisionOption {
  id: string;
  label: string;
  correct: boolean;
  points: number;
  feedback: string;
  riskTag: string | null;
}

export interface DecisionNode {
  id: string;
  question: string;
  frameLabel: string;
  timeAt: string;
  progressPct: number;
  options: DecisionOption[];
}

export interface Scenario {
  episodeNum: number;
  duration: string;
  decisions: DecisionNode[];
}
