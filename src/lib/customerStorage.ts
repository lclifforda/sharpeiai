/**
 * Persist customers (companies) to localStorage for demo purposes.
 * New customers are added when applications are submitted.
 */

const STORAGE_KEY = "sharpei_customers";

export interface StoredCustomer {
  id: string;
  name: string;
  industry: string;
  location: string;
  representatives: number;
  activeContracts: number;
  revenue: string;
  status: "active" | "inactive";
  logo?: string;
  formData?: Record<string, string>;
}

export function getStoredCustomers(): StoredCustomer[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomer(customer: StoredCustomer): void {
  const customers = getStoredCustomers();
  if (!customers.some((c) => c.id === customer.id)) {
    customers.push(customer);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
  }
}

export function getCustomerById(id: string): StoredCustomer | undefined {
  return getStoredCustomers().find((c) => c.id === id);
}

export function getOrCreateCustomerFromApplication(formData: Record<string, string>): string {
  const companyName = formData.companyName || "Unknown";
  const existing = getStoredCustomers().find(
    (c) => c.name.toLowerCase() === companyName.toLowerCase()
  );
  if (existing) return existing.id;

  const customerId = `cust-${String(Date.now()).slice(-6)}`;
  const city = formData.city || "";
  const state = formData.state || "";
  const location = [city, state].filter(Boolean).join(", ") || "—";
  const industry = formData.industry || formData.entityType || "—";

  saveCustomer({
    id: customerId,
    name: companyName,
    industry,
    location,
    representatives: formData.contactName ? 1 : 0,
    activeContracts: 0,
    revenue: "$0",
    status: "active",
    formData: { ...formData },
  });

  return customerId;
}
