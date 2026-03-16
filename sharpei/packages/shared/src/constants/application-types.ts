export const APPLICATION_TYPES = {
  'equipment-financing': {
    name: 'Equipment Financing',
    description: 'Traditional equipment financing with fixed terms',
    icon: 'Banknote',
  },
  'working-capital': {
    name: 'Working Capital',
    description: 'Short-term working capital loans',
    icon: 'Briefcase',
  },
  'equipment-leasing': {
    name: 'Equipment Leasing',
    description: 'Lease-to-own and operating leases',
    icon: 'Package',
  },
} as const;

export type ApplicationTypeId = keyof typeof APPLICATION_TYPES;
