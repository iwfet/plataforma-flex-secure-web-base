
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { papeisApi } from '@/api/endpoints/papeis';
import { useToast } from '@/hooks/use-toast';
import { PapelDTO, NovoPapelDTO, AtualizaPapelDTO } from '@/types/papeis';

export const usePapeisManager = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const papeis = useQuery({
    queryKey: ['papeis'],
    queryFn: papeisApi.list,
  });

  // Fixed: Changed the function to return actual query result instead of the useQuery hook
  const getPapel = (id: number) => {
    return useQuery({
      queryKey: ['papel', id],
      queryFn: () => papeisApi.get(id),
      enabled: !!id && id > 0,
      retry: 1,
      staleTime: 5 * 60 * 1000,
      // Using onError directly in the options as supported by Tanstack Query v5
      onError: (error: any) => {
        console.error(`Error fetching papel with ID ${id}:`, error);
      }
    });
  };

  const getPermissoes = (papelId: number) => {
    return useQuery({
      queryKey: ['papel', papelId, 'permissoes'],
      queryFn: () => papeisApi.listPermissoes(papelId),
      enabled: !!papelId && papelId > 0,
      retry: 1,
    });
  };

  const createPapel = useMutation({
    mutationFn: (data: NovoPapelDTO) => papeisApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['papeis'] });
      toast({
        title: "Papel criado",
        description: "O papel foi criado com sucesso",
      });
    },
    onError: (error: any) => {
      console.error('Error creating papel:', error);
      toast({
        title: "Erro ao criar papel",
        description: error?.message || "Ocorreu um erro ao criar o papel",
        variant: "destructive",
      });
    },
  });

  const updatePapel = useMutation({
    mutationFn: ({ id, data }: { id: number; data: AtualizaPapelDTO }) => 
      papeisApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['papeis'] });
      queryClient.invalidateQueries({ queryKey: ['papel', variables.id] });
      toast({
        title: "Papel atualizado",
        description: "O papel foi atualizado com sucesso",
      });
    },
    onError: (error: any) => {
      console.error('Error updating papel:', error);
      toast({
        title: "Erro ao atualizar papel",
        description: error?.message || "Ocorreu um erro ao atualizar o papel",
        variant: "destructive",
      });
    },
  });

  const deletePapel = useMutation({
    mutationFn: (id: number) => papeisApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['papeis'] });
      toast({
        title: "Papel removido",
        description: "O papel foi removido com sucesso",
      });
    },
    onError: (error: any) => {
      console.error('Error deleting papel:', error);
      toast({
        title: "Erro ao remover papel",
        description: error?.message || "Ocorreu um erro ao remover o papel",
        variant: "destructive",
      });
    },
  });

  const addPermissao = useMutation({
    mutationFn: ({ papelId, telaId }: { papelId: number; telaId: number }) => 
      papeisApi.addPermissao(papelId, telaId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['papel', variables.papelId, 'permissoes'] });
      toast({
        title: "Permissão adicionada",
        description: "A permissão foi adicionada com sucesso",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao adicionar permissão",
        description: error?.message || "Ocorreu um erro ao adicionar a permissão",
        variant: "destructive",
      });
    },
  });

  const removePermissao = useMutation({
    mutationFn: ({ papelId, telaId }: { papelId: number; telaId: number }) => 
      papeisApi.removePermissao(papelId, telaId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['papel', variables.papelId, 'permissoes'] });
      toast({
        title: "Permissão removida",
        description: "A permissão foi removida com sucesso",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao remover permissão",
        description: error?.message || "Ocorreu um erro ao remover a permissão",
        variant: "destructive",
      });
    },
  });

  return {
    papeis,
    getPapel,
    getPermissoes,
    createPapel,
    updatePapel,
    deletePapel,
    addPermissao,
    removePermissao,
  };
};
