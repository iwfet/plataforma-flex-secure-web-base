
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { PapelDTO } from '@/types/papeis';
import { Loader2, Save, X } from 'lucide-react';
import { Card } from '@/components/ui/card';

const formSchema = z.object({
  nomePapel: z
    .string()
    .min(3, { message: 'Nome deve ter pelo menos 3 caracteres' })
    .max(50, { message: 'Nome deve ter no máximo 50 caracteres' }),
  descricao: z
    .string()
    .min(3, { message: 'Descrição deve ter pelo menos 3 caracteres' })
    .max(200, { message: 'Descrição deve ter no máximo 200 caracteres' }),
});

type PapelFormValues = z.infer<typeof formSchema>;

interface PapelFormProps {
  papel?: PapelDTO;
  onSubmit: (values: PapelFormValues) => void;
  isSubmitting: boolean;
}

const PapelForm = ({ papel, onSubmit, isSubmitting }: PapelFormProps) => {
  const form = useForm<PapelFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomePapel: papel?.nomePapel || '',
      descricao: papel?.descricao || '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="nomePapel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Papel</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: Administrador" />
                </FormControl>
                <FormDescription>
                  Um nome curto e claro que identifica o papel
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Descreva o papel e suas funções"
                      rows={3}
                      className="resize-y"
                    />
                  </FormControl>
                  <FormDescription>
                    Explique o propósito deste papel e que tipo de usuário deve utilizá-lo
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => form.reset()}
            disabled={isSubmitting}
          >
            <X className="mr-2 h-4 w-4" />
            Limpar
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {papel ? 'Atualizar' : 'Criar'}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PapelForm;
