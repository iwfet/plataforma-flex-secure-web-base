
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTelasApi, TelaResponse } from '@/api/endpoints/telas';
import { useLoading } from '@/contexts/LoadingContext';
import { useToast } from '@/hooks/use-toast';

export const useTelasManager = () => {
  const [selectedTelaId, setSelectedTelaId] = useState<number | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const telasApiHook = useTelasApi();
  const { onLoadingStart, onLoadingEnd } = useLoading();

  const { data: telas } = useQuery({
    queryKey: ['telas'],
    queryFn: () => {
      onLoadingStart();
      return telasApiHook.listarTelas()
        .finally(() => onLoadingEnd());
    },
  });

  const selectedTela = telas?.find(tela => tela.id === selectedTelaId) || 
    telas?.flatMap(tela => tela.subtelas).find(subtela => subtela?.id === selectedTelaId);

  const deleteMutation = useMutation({
    mutationFn: telasApiHook.excluirTela,
    onMutate: onLoadingStart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['telas'] });
      setSelectedTelaId(null);
      setIsDeleteDialogOpen(false);
      toast({
        title: "Tela removida",
        description: "A tela foi excluída com sucesso",
      });
      onLoadingEnd();
    },
    onError: (error) => {
      console.error('Erro ao excluir tela:', error);
      toast({
        title: "Erro ao remover",
        description: "Não foi possível excluir a tela.",
        variant: "destructive"
      });
      onLoadingEnd();
    }
  });

  const handleDelete = () => {
    if (!selectedTelaId) return;
    deleteMutation.mutate(selectedTelaId);
  };

  const handleCreateSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['telas'] });
    setIsCreateDialogOpen(false);
    toast({
      title: "Tela criada",
      description: "A nova tela foi criada com sucesso",
    });
  };

  const handleEditSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['telas'] });
    setIsEditDialogOpen(false);
    toast({
      title: "Tela atualizada",
      description: "A tela foi atualizada com sucesso",
    });
  };

  return {
    selectedTelaId,
    setSelectedTelaId,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    telas,
    selectedTela,
    handleDelete,
    handleCreateSuccess,
    handleEditSuccess
  };
};
