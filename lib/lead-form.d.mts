export type LeadData = {
  interest: string;
  country: string;
  timeline: string;
  contact: string;
  name: string;
  email: string;
  phone: string;
};
export type LeadErrorCode = 'select' | 'required' | 'email' | 'phone';
export function normalizeLead(data: Partial<LeadData>): LeadData;
export function contactRequirements(contact: string): { email: boolean; phone: boolean };
export function validateLeadStep(data: Partial<LeadData>, step: number): Partial<Record<keyof LeadData, LeadErrorCode>>;
export function sendLead(data: LeadData, options: {
  accessKey: string;
  locale?: 'en' | 'de' | 'ru';
  page?: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}): Promise<void>;
