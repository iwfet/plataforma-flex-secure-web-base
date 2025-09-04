
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { EndpointFormDialog } from './EndpointFormDialog';
import { telasApi, Endpoint } from '@/api/endpoints/telas';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TelaEndpointsProps {
  telaId: number;
}

export const TelaEndpoints: React.FC<TelaEndpointsProps> = ({ telaId }) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [endpointToDelete, setEndpointToDelete] = useState<Endpoint | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: endpoints, isLoading } = useQuery({
    queryKey: ['endpoints', telaId],
    queryFn: () => telasApi.listarEndpoints(telaId)
  });

  const deleteMutation = useMutation({
    mutationFn: (endpointId: number) => telasApi.removerEndpoint(telaId, endpointId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['endpoints', telaId] });
      toast({
        title: "Endpoint removido",
        description: "O endpoint foi excluído com sucesso",
      });
      setEndpointToDelete(null);
    },
    onError: (error) => {
      console.error('Erro ao excluir endpoint:', error);
      toast({
        title: "Erro ao remover",
        description: "Não foi possível excluir o endpoint.",
        variant: "destructive"
      });
    }
  });

  const handleSuccess = () => {
    setIsAddDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: ['endpoints', telaId] });
    toast({
      title: "Endpoint adicionado",
      description: "O novo endpoint foi adicionado com sucesso",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Endpoint</span>
        </Button>
      </div>

      {isLoading ? (
        <div>Carregando endpoints...</div>
      ) : endpoints?.length === 0 ? (
        <div className="text-center text-gray-500">
          Nenhum endpoint cadastrado
        </div>
      ) : (
        <div className="space-y-4">
          {endpoints?.map((endpoint) => (
            <div
              key={endpoint.id}
              className="flex items-start justify-between p-4 border rounded-lg"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 text-xs font-semibold rounded bg-primary/10 text-primary">
                    {endpoint.method}
                  </span>
                  <span className="font-mono text-sm">{endpoint.endpoint}</span>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  {endpoint.description}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEndpointToDelete(endpoint)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <EndpointFormDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSuccess={handleSuccess}
        telaId={telaId}
      />

      <AlertDialog 
        open={!!endpointToDelete} 
        onOpenChange={(open) => !open && setEndpointToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Endpoint</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este endpoint?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => endpointToDelete && deleteMutation.mutate(endpointToDelete.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
