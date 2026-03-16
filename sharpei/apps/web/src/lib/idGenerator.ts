// Utility function to generate unique IDs for React components
let idCounter = 0;

export const generateUniqueId = (prefix: string = 'id'): string => {
  return `${prefix}-${Date.now()}-${++idCounter}`;
};

// Alternative using crypto if available (more robust)
export const generateCryptoId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return generateUniqueId('msg');
};
