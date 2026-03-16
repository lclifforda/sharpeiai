import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function usePlatformConfig() {
  return useQuery({
    queryKey: ['platform-config'],
    queryFn: async () => {
      const { data } = await api.get('/platform-config');
      return data;
    },
  });
}

export function useUpdatePlatformConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: any) => {
      const { data } = await api.put('/platform-config', body);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['platform-config'] }),
  });
}
