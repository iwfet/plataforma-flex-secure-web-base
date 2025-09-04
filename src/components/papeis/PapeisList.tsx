
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePapeisManager } from '@/hooks/usePapeisManager';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Edit, Trash2, Shield, Loader2, Search } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { PapelDTO } from '@/types/papeis';
import { Input } from '@/components/ui/input';

const PapeisList = () => {
  const navigate = useNavigate();
  const { papeis, deletePapel } = usePapeisManager();
  const [papelToDelete, setPapelToDelete] = useState<PapelDTO | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleEdit = (id: number) => {
    navigate(`/papeis/editar/${id}`);
  };

  const handleDelete = (papel: PapelDTO) => {
    setPapelToDelete(papel);
  };

  const confirmDelete = () => {
    if (papelToDelete) {
      deletePapel.mutate(papelToDelete.id);
      setPapelToDelete(null);
    }
  };

  // Filtrar papéis com base no termo de busca
  const filteredPapeis = papeis.data?.filter(papel => {
    if (!searchTerm) return true;
    
    const searchTermLower = searchTerm.toLowerCase();
    return (
      papel.nomePapel.toLowerCase().includes(searchTermLower) ||
      papel.descricao.toLowerCase().includes(searchTermLower) ||
      papel.id.toString().includes(searchTermLower)
    );
  });

  if (papeis.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p>Carregando papéis...</p>
      </div>
    );
  }

  if (papeis.isError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4 text-red-500 bg-red-50 rounded-md">
        <Shield className="w-12 h-12 mb-2" />
        <p className="font-medium">Erro ao carregar papéis</p>
        <p className="text-sm">Tente novamente mais tarde ou contate o suporte.</p>
        <Button 
          variant="outline" 
          className="mt-2"
          onClick={() => papeis.refetch()}
        >
          Tentar novamente
        </Button>
      </div>
    );
  }

  if (!papeis.data || papeis.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-gray-500 border-2 border-dashed rounded-lg">
        <Shield className="w-14 h-14 mb-4 text-muted-foreground opacity-30" />
        <p className="font-medium text-lg">Nenhum papel encontrado</p>
        <p className="text-sm text-muted-foreground mt-2 text-center max-w-md">
          Crie um novo papel para definir as permissões de acesso ao sistema
        </p>
        <Button 
          className="mt-6"
          onClick={() => navigate('/papeis/novo')}
        >
          Novo Papel
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar papéis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full max-w-md"
          />
        </div>
      </div>
      
      <div className="relative overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Nome</TableHead>
              <TableHead className="w-[45%]">Descrição</TableHead>
              <TableHead className="w-[15%] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPapeis?.map((papel) => (
              <TableRow key={papel.id} className="group">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 h-8 w-8 rounded-md flex items-center justify-center">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <span>{papel.nomePapel}</span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        ID: {papel.id}
                      </Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{papel.descricao}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2 opacity-70 group-hover:opacity-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(papel.id)}
                      className="h-8 w-8"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(papel)}
                      className="h-8 w-8 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!papelToDelete} onOpenChange={() => setPapelToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o papel <span className="font-semibold">"{papelToDelete?.nomePapel}"</span>? 
              <p className="mt-2 text-destructive">Esta ação não pode ser desfeita.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deletePapel.isPending}
            >
              {deletePapel.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                "Excluir"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PapeisList;
