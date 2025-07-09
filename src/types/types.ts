// Shared types for the app

export type Service = {
  id: number;
  name: string;
  service_type: string;
  status: string;
  healthScore: number;
  aiSummary: string;
  avgLatency: number;
  errorRate: number;
  uptimeHistory: { day: string; uptime: number }[];
  latencyHistory?: { hour: string; ms: number }[];
  errorRateHistory?: { hour: string; rate: number }[];
  dailyChecks: DailyHealthCheck[];
  rootCauseAnalysis?: RootCauseAnalysis;
};

export type DailyHealthCheck = {
  date: string;
  status: string;
  summary: string;
  details: string; // Now a single markdown string
  aiAnalysis: string;
};

export type RootCauseAnalysis = {
  problem: string;
  timeline: string[];
  probableCause: string;
  recommendation: string;
};

export type UXFlow = {
  id: string;
  name: string;
  status: string;
  conversionRate: number;
  trend: number;
  avgTime: string;
  aiSummary: string;
  funnel: { step: string; users: number }[];
  frictionPoints: FrictionPoint[];
  historicalPerformance: { date: string; rate: number }[];
};

export type FrictionPoint = {
  id: string;
  type: string;
  severity: 'High' | 'Medium' | 'Low';
  description: string;
  element: string;
  browser: string;
  device: string;
};

export type Report = {
  id: string;
  title: string;
  date: string;
  type: string;
};
