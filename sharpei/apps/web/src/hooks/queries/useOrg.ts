import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function useOrg() {
  return useQuery({
    queryKey: ['org'],
    queryFn: async () => {
      const { data } = await api.get('/orgs/me');
      return data;
    },
  });
}

export function useUpdateOrg() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: any) => {
      const { data } = await api.patch('/orgs/me', body);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['org'] }),
  });
}
