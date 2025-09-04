
import React from 'react';
import { UseMutationResult } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { UserDTO } from '@/types/user';
import { PapelDTO } from '@/types/papeis';
import { AtribuirPapelDTO } from '@/api/endpoints/usuarioPapel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AtribuicaoPapelFormProps {
  selectedUserId: string;
  setSelectedUserId: (id: string) => void;
  selectedPapelId: string;
  setSelectedPapelId: (id: string) => void;
  usuariosDisponiveis: UserDTO[];
  papeis: any; // Using any here since it's from the original component
  handleAtribuir: () => void;
  atribuirPapelMutation: UseMutationResult<void, Error, AtribuirPapelDTO>;
}

const AtribuicaoPapelForm: React.FC<AtribuicaoPapelFormProps> = ({
  selectedUserId,
  setSelectedUserId,
  selectedPapelId,
  setSelectedPapelId,
  usuariosDisponiveis,
  papeis,
  handleAtribuir,
  atribuirPapelMutation,
}) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Atribuir Papel ao Usuário</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium mb-1 block">Usuário</label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um usuário" />
              </SelectTrigger>
              <SelectContent>
                {usuariosDisponiveis.map(usuario => (
                  <SelectItem key={usuario.id} value={usuario.id.toString()}>
                    {usuario.nomeUsuario} ({usuario.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1">
            <label className="text-sm font-medium mb-1 block">Papel</label>
            <Select value={selectedPapelId} onValueChange={setSelectedPapelId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um papel" />
              </SelectTrigger>
              <SelectContent>
                {papeis.data?.map((papel: PapelDTO) => (
                  <SelectItem key={papel.id} value={papel.id.toString()}>
                    {papel.nomePapel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-end">
            <Button 
              onClick={handleAtribuir}
              disabled={!selectedUserId || !selectedPapelId || atribuirPapelMutation.isPending}
            >
              {atribuirPapelMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Atribuindo...
                </>
              ) : (
                <>Atribuir Papel</>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AtribuicaoPapelForm;
