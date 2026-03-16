import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/stats');
      return data;
    },
  });
}

export function useDashboardFunnel() {
  return useQuery({
    queryKey: ['dashboard', 'funnel'],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/funnel');
      return data;
    },
  });
}
