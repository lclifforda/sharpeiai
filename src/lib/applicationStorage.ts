/**
 * Persist submitted applications to localStorage for demo purposes.
 * No database required — data survives page refresh.
 */

const STORAGE_KEY = "sharpei_submitted_applications";

export interface AIAssessmentSummary {
  recommendation: 'strong' | 'moderate' | 'weak';
  text: string;
  highlights: { label: string; value: string; positive: boolean }[];
}

export interface StoredApplication {
  id: string;
  companyId?: string;
  company: string;
  contact: string;
  type: string;
  equipment: string;
  amount: string;
  vendor: string;
  status: string;
  date: string;
  formData: Record<string, string>;
  equipmentItems?: { description: string; vendor: string; quantity: number; unitCost: number }[];
  documents?: { id: string; type: string; fileName: string; status: string }[];
  aiSummary?: AIAssessmentSummary;
  assignedOfficerId?: string;
  assignedOfficerName?: string;
  assignedAt?: string;
}

export function getStoredApplications(): StoredApplication[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveApplication(app: StoredApplication): void {
  const apps = getStoredApplications();
  if (!apps.some((a) => a.id === app.id)) {
    apps.unshift(app);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
  }
}

export function updateApplication(id: string, patch: Partial<StoredApplication>): void {
  const apps = getStoredApplications();
  const idx = apps.findIndex((a) => a.id === id);
  if (idx >= 0) {
    apps[idx] = { ...apps[idx], ...patch };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
  }
}

export function getApplicationById(id: string): StoredApplication | undefined {
  return getStoredApplications().find((a) => a.id === id);
}
