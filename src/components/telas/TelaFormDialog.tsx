
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useTelasApi, TelaRequest, TelaResponse } from '@/api/endpoints/telas';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { TelaBasicFields } from './TelaBasicFields';
import { TelaAdvancedFields } from './TelaAdvancedFields';
import { TelaIconSelector } from './TelaIconSelector';
import { useToast } from "@/hooks/use-toast";
import { verificaCicloHierarquia } from '@/utils/telaUtils';

const formSchema = z.object({
  nomeTela: z.string().min(1, { message: 'Nome da tela é obrigatório' }),
  path: z.string().min(1, { message: 'Caminho é obrigatório' })
    .regex(/^\//, { message: 'O caminho deve começar com /' }),
  descricao: z.string().optional(),
  ativo: z.boolean().default(true),
  telaPaiId: z.number().nullable().optional(),
  ordem: z.number().optional(),
  icone: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

interface TelaFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  tela?: TelaResponse;
  parentId?: number | null;
  availableTelas: TelaResponse[];
  isEditing?: boolean;
}

export const TelaFormDialog: React.FC<TelaFormDialogProps> = ({
  open,
  onClose,
  onSuccess,
  tela,
  parentId,
  availableTelas,
  isEditing = false,
}) => {
  const telasApiHook = useTelasApi();
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomeTela: tela?.nomeTela || '',
      path: tela?.path || '/',
      descricao: tela?.descricao || '',
      ativo: tela?.ativo ?? true,
      telaPaiId: tela?.telaPaiId || parentId || null,
      ordem: tela?.ordem || undefined,
      icone: tela?.icone || null,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        nomeTela: tela?.nomeTela || '',
        path: tela?.path || '/',
        descricao: tela?.descricao || '',
        ativo: tela?.ativo ?? true,
        telaPaiId: tela?.telaPaiId || parentId || null,
        ordem: tela?.ordem || undefined,
        icone: tela?.icone || null,
      });
    }
  }, [open, tela, parentId, form]);

  const createMutation = useMutation({
    mutationFn: (formData: FormValues) => {
      const telaData: TelaRequest = {
        nomeTela: formData.nomeTela,
        path: formData.path,
        descricao: formData.descricao || '',
        ativo: formData.ativo,
        telaPaiId: formData.telaPaiId,
        ordem: formData.ordem,
        icone: formData.icone
      };
      return telasApiHook.criarTela(telaData);
    },
    onSuccess: () => {
      form.reset();
      onSuccess();
    },
    onError: (error) => {
      console.error('Erro ao criar tela:', error);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormValues }) => {
      const telaData: TelaRequest = {
        nomeTela: data.nomeTela,
        path: data.path,
        descricao: data.descricao || '',
        ativo: data.ativo,
        telaPaiId: data.telaPaiId,
        ordem: data.ordem,
        icone: data.icone
      };
      return telasApiHook.atualizarTela(id, telaData);
    },
    onSuccess: () => {
      onSuccess();
    },
    onError: (error) => {
      console.error('Erro ao atualizar tela:', error);
    }
  });

  const handleDialogClose = () => {
    form.reset();
    onClose();
  };

  const onSubmit = (values: FormValues) => {
    // Verificar ciclo hierárquico apenas se estiver editando e houver uma tela
    if (isEditing && tela) {
      // Verifique se a mudança do pai criaria um ciclo na hierarquia
      if (verificaCicloHierarquia(tela.id, values.telaPaiId || null, availableTelas)) {
        toast({
          title: "Erro ao atualizar tela",
          description: "Esta operação criaria um ciclo na hierarquia de telas",
          variant: "destructive",
        });
        return;
      }
      
      // Se estamos mudando para um novo pai e o ID atual da tela tem filhos
      // então atualizamos em duas etapas para evitar ciclos
      if (values.telaPaiId !== tela.telaPaiId && tela.subtelas?.length > 0) {
        // Primeiro, atualizamos apenas o pai para null (quebra qualquer ciclo potencial)
        telasApiHook.atualizarTela(tela.id, { ...tela, telaPaiId: null })
          .then(() => {
            // Em seguida, atualizamos com os valores completos
            updateMutation.mutate({ id: tela.id, data: values });
          })
          .catch(error => {
            console.error('Erro ao atualizar pai temporariamente:', error);
            toast({
              title: "Erro ao atualizar tela",
              description: "Falha ao tentar atualizar a hierarquia",
              variant: "destructive",
            });
          });
      } else {
        // Caso normal, sem risco de ciclo
        updateMutation.mutate({ id: tela.id, data: values });
      }
    } else {
      // Criação normal, sem verificação de ciclo necessária
      createMutation.mutate(values);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Tela' : 'Criar Nova Tela'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <TelaBasicFields control={form.control} />

            <TelaIconSelector control={form.control} />

            <TelaAdvancedFields
              control={form.control}
              availableTelas={availableTelas}
              isEditing={isEditing}
              currentTelaId={tela?.id}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleDialogClose}
                className="mr-2"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
