
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
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TelaResponse } from '@/api/endpoints/telas';

interface TelaAdvancedFieldsProps {
  control: any;
  availableTelas: TelaResponse[];
  isEditing?: boolean;
  currentTelaId?: number;
}

export const TelaAdvancedFields = ({ 
  control, 
  availableTelas,
  isEditing,
  currentTelaId 
}: TelaAdvancedFieldsProps) => {
  const availableParents = availableTelas.filter(t => !isEditing || t.id !== currentTelaId);

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="telaPaiId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tela Pai</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value === "" ? null : Number(value))}
                value={field.value?.toString() || ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a tela pai" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">Nenhuma (Tela principal)</SelectItem>
                  {availableParents.map((t) => (
                    <SelectItem key={t.id} value={t.id.toString()}>
                      {t.nomeTela}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Tela pai ou deixe em branco para tela principal
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="ordem"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ordem</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Ordem de exibição" 
                  {...field} 
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="ativo"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between space-x-2 space-y-0 rounded-md border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">
                Ativo
              </FormLabel>
              <FormDescription>
                Determina se a tela está ativa no sistema
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
