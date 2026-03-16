import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function useKnowledgeBase(params?: { search?: string }) {
  return useQuery({
    queryKey: ['knowledge-base', params],
    queryFn: async () => {
      const { data } = await api.get('/knowledge-base', { params });
      return data;
    },
  });
}

export function useKnowledgeBaseItem(id: string) {
  return useQuery({
    queryKey: ['knowledge-base', id],
    queryFn: async () => {
      const { data } = await api.get(`/knowledge-base/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateKnowledgeBaseItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: any) => {
      const { data } = await api.post('/knowledge-base', body);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['knowledge-base'] }),
  });
}

export function useUpdateKnowledgeBaseItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...body }: { id: string } & Record<string, any>) => {
      const { data } = await api.patch(`/knowledge-base/${id}`, body);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['knowledge-base'] }),
  });
}

export function useDeleteKnowledgeBaseItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/knowledge-base/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['knowledge-base'] }),
  });
}
