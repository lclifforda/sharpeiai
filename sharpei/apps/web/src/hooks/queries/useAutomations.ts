import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function useAutomations(params?: { status?: string; search?: string }) {
  return useQuery({
    queryKey: ['automations', params],
    queryFn: async () => {
      const { data } = await api.get('/automations', { params });
      return data;
    },
  });
}

export function useAutomation(id: string) {
  return useQuery({
    queryKey: ['automations', id],
    queryFn: async () => {
      const { data } = await api.get(`/automations/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateAutomation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: any) => {
      const { data } = await api.post('/automations', body);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['automations'] }),
  });
}

export function useUpdateAutomation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...body }: { id: string } & Record<string, any>) => {
      const { data } = await api.patch(`/automations/${id}`, body);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['automations'] }),
  });
}

export function useDeleteAutomation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/automations/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['automations'] }),
  });
}

export function useAutomationExecutions(automationId: string) {
  return useQuery({
    queryKey: ['automations', automationId, 'executions'],
    queryFn: async () => {
      const { data } = await api.get(`/automations/${automationId}/executions`);
      return data;
    },
    enabled: !!automationId,
  });
}
