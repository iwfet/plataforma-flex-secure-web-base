
import React from 'react';
import { TelaFormDialog } from '@/components/telas/TelaFormDialog';
import { TelasHeader } from '@/components/telas/TelasHeader';
import { TelasTreeSection } from '@/components/telas/TelasTreeSection';
import { TelasDetails } from '@/components/telas/TelasDetails';
import { useTelasManager } from '@/hooks/useTelasManager';
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

const TelasGerenciamento = () => {
  const {
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
  } = useTelasManager();

  return (
    <div className="container mx-auto py-6">
      <TelasHeader onCreateClick={() => setIsCreateDialogOpen(true)} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TelasTreeSection
          telas={telas || []}
          selectedTelaId={selectedTelaId}
          onSelectTela={setSelectedTelaId}
        />

        <TelasDetails
          selectedTela={selectedTela}
          onEditClick={() => setIsEditDialogOpen(true)}
          onDeleteClick={() => setIsDeleteDialogOpen(true)}
        />
      </div>

      <TelaFormDialog 
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={handleCreateSuccess}
        parentId={selectedTelaId}
        availableTelas={telas || []}
      />

      {selectedTela && (
        <TelaFormDialog 
          key={`edit-${selectedTelaId}`}
          open={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSuccess={handleEditSuccess}
          tela={selectedTela}
          availableTelas={telas || []}
          isEditing
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Tela</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta tela? Todas as subtelas também serão removidas.
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
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

export default TelasGerenciamento;
