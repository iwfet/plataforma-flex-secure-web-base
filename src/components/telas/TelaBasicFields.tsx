
import React from 'react';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface TelaBasicFieldsProps {
  control: any;
}

export const TelaBasicFields = ({ control }: TelaBasicFieldsProps) => {
  return (
    <>
      <FormField
        control={control}
        name="nomeTela"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome da Tela</FormLabel>
            <FormControl>
              <Input placeholder="Nome da tela" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="path"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Caminho (URL)</FormLabel>
            <FormControl>
              <Input placeholder="/caminho-da-tela" {...field} />
            </FormControl>
            <FormDescription>
              O caminho deve começar com / (ex: /dashboard)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="descricao"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Descrição da tela" 
                className="resize-none" 
                rows={3}
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
