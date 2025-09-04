
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usuarioPapelApi, AtribuirPapelDTO } from '@/api/endpoints/usuarioPapel';
import { useToast } from '@/hooks/use-toast';

export const useUsuarioPapelManager = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const listarAtribuicoes = useQuery({
    queryKey: ['usuarioPapel', 'atribuicoes'],
    queryFn: usuarioPapelApi.listarAtribuicoes,
  });

  const listarUsuariosPorPapel = (papelId: number) => {
    return useQuery({
      queryKey: ['usuarioPapel', 'usuarios', papelId],
      queryFn: () => usuarioPapelApi.listarUsuariosPorPapel(papelId),
      enabled: !!papelId,
    });
  };

  const buscarPapelDoUsuario = (usuarioId: number) => {
    return useQuery({
      queryKey: ['usuarioPapel', 'papel', usuarioId],
      queryFn: () => usuarioPapelApi.buscarPapelDoUsuario(usuarioId),
      enabled: !!usuarioId,
    });
  };

  const atribuirPapel = useMutation({
    mutationFn: (data: AtribuirPapelDTO) => usuarioPapelApi.atribuirPorBody(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['usuarioPapel'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Papel atribuído",
        description: "O papel foi atribuído ao usuário com sucesso",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atribuir papel",
        description: error?.message || "Ocorreu um erro ao atribuir o papel ao usuário",
        variant: "destructive",
      });
    },
  });

  const removerPapel = useMutation({
    mutationFn: (usuarioId: number) => usuarioPapelApi.removerPapel(usuarioId),
    onSuccess: (_, usuarioId) => {
      queryClient.invalidateQueries({ queryKey: ['usuarioPapel'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Papel removido",
        description: "O papel foi removido do usuário com sucesso",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao remover papel",
        description: error?.message || "Ocorreu um erro ao remover o papel do usuário",
        variant: "destructive",
      });
    },
  });

  return {
    listarAtribuicoes,
    listarUsuariosPorPapel,
    buscarPapelDoUsuario,
    atribuirPapel,
    removerPapel,
  };
};
