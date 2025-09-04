
import React from 'react';
import { UseMutationResult } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2, Shield, Trash2, User } from 'lucide-react';
import { UsuarioPapelDTO } from '@/api/endpoints/usuarioPapel';

interface AtribuicoesPapelTableProps {
  atribuicoes: UsuarioPapelDTO[];
  isLoading: boolean;
  handleRemover: (usuarioId: number) => void;
  removerPapelMutation: UseMutationResult<void, Error, number>;
  searchTerm: string;
}

const AtribuicoesPapelTable: React.FC<AtribuicoesPapelTableProps> = ({
  atribuicoes,
  isLoading,
  handleRemover,
  removerPapelMutation,
  searchTerm,
}) => {
  const filteredAtribuicoes = atribuicoes.filter(atribuicao => {
    if (!searchTerm) return true;
    
    const nomeUsuario = atribuicao.nomeUsuario || '';
    const nomePapel = atribuicao.nomePapel || '';
    
    const searchTermLower = searchTerm.toLowerCase();
    
    return nomeUsuario.toLowerCase().includes(searchTermLower) ||
           nomePapel.toLowerCase().includes(searchTermLower);
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
      </div>
    );
  }

  if (filteredAtribuicoes.length === 0) {
    return (
      <div className="text-center py-12 border rounded-md bg-muted/10">
        <User className="h-12 w-12 text-muted mx-auto mb-3" />
        <h3 className="text-lg font-medium">Nenhuma atribuição encontrada</h3>
        <p className="text-muted-foreground mt-1">
          Atribua papéis aos usuários usando o formulário acima
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Usuário</TableHead>
          <TableHead>Papel</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredAtribuicoes.map((atribuicao) => (
          <TableRow key={atribuicao.id}>
            <TableCell>
              <Badge variant="outline" className="bg-primary/5">
                {atribuicao.id}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{atribuicao.nomeUsuario}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span>{atribuicao.nomePapel}</span>
              </div>
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemover(atribuicao.usuarioId)}
                disabled={removerPapelMutation.isPending}
                className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AtribuicoesPapelTable;
