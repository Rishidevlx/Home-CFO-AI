export interface DBUser {
  id: string;
  phone: string;
  family_size: number;
  salary: number;
  created_at: string;
}

export interface DBCommitment {
  id: string;
  user_id: string;
  name: string;
  amount: number;
}

export interface DBSession {
  id: string;
  user_id: string;
  analysis: string; // JSON string
  created_at: string;
}

export interface PotentialSaving {
  category: string;
  currentEstimate: number;
  suggestion: string;
  potentialSaveAmount: number;
}

export interface InvestmentOption {
  monthlyAllocation: number;
  pros: string[];
  cons: string[];
  note: string;
}

export interface InvestmentStrategy {
  sip: InvestmentOption;
  postOffice: InvestmentOption;
  gold: InvestmentOption;
  drasticInactionConsequences: string;
  actionBenefits: string;
}

export interface CFOAnalysis {
  essentialNeedsBudget: number;
  commitmentsSummary: number;
  familyHappinessBudget: number;
  mentalWellbeingBudget: number;
  savingsBuffer: number;
  financialWellnessScore: number;
  potentialSavings: PotentialSaving[];
  summaryText: string;
  investmentStrategy?: InvestmentStrategy;
}

export interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  report?: CFOAnalysis; // If the message contains the generated report
  loading?: boolean;
}
