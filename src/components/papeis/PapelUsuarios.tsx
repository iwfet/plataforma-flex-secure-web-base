import  { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/api/endpoints/users';
import { useUsuarioPapelManager } from '@/hooks/useUsuarioPapelManager';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Loader2, Trash, User, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface PapelUsuariosProps {
  papelId: number;
}

const PapelUsuarios = ({ papelId }: PapelUsuariosProps) => {
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: usersApi.list,
  });

  const { 
    listarUsuariosPorPapel, 
    atribuirPapel, 
    removerPapel 
  } = useUsuarioPapelManager();
  
  const { 
    data: usuariosComPapel = [], 
    isLoading: isLoadingUsuariosPapel 
  } = listarUsuariosPorPapel(papelId);

  // Filtra usuários com base no termo de busca
  const filteredUsuarios = usuariosComPapel.filter(user => {
    if (!searchTerm) return true;
    
    const searchTermLower = searchTerm.toLowerCase();
    return (
      user.nomeUsuario.toLowerCase().includes(searchTermLower) ||
      user.email.toLowerCase().includes(searchTermLower) ||
      user.id.toString().includes(searchTermLower)
    );
  });

  const handleAtribuirPapel = () => {
    if (selectedUserId) {
      atribuirPapel.mutate({
        usuarioId: parseInt(selectedUserId),
        papelId
      });
      setSelectedUserId('');
    }
  };

  const handleRemoverPapel = (usuarioId: number) => {
    removerPapel.mutate(usuarioId);
  };

  // Filtra usuários que já têm o papel atribuído
  const usuariosDisponiveis = users.filter(
    user => !usuariosComPapel.some(u => u.id === user.id)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">Usuários com este papel</h3>
      </div>
      
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-end gap-3">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Usuário</label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar usuário" />
                </SelectTrigger>
                <SelectContent>
                  {usuariosDisponiveis.map(user => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.nomeUsuario} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={handleAtribuirPapel} 
              disabled={!selectedUserId || atribuirPapel.isPending}
            >
              {atribuirPapel.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Atribuindo...
                </>
              ) : (
                'Atribuir ao Papel'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="mb-4">
        <Input
          placeholder="Buscar usuário..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {isLoadingUsuariosPapel ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
        </div>
      ) : filteredUsuarios.length === 0 ? (
        <div className="text-center py-12 border rounded-md bg-muted/10">
          <Users className="h-12 w-12 text-muted mx-auto mb-3" />
          <h3 className="text-lg font-medium">Nenhum usuário atribuído</h3>
          <p className="text-muted-foreground mt-1">
            Atribua este papel a usuários utilizando o seletor acima
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Papel</TableHead>
              <TableHead>Nome Usuário</TableHead>
              <TableHead>Papel</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsuarios.map(user => (
              <TableRow key={user.id} className="group">
                <TableCell>
                  <Badge variant="outline" className="bg-primary/5">
                    {user.id}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{user.nomeUsuario}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{user.nomePapel}</TableCell>
                <TableCell>
                  {user.ativo ? (
                    <Badge variant="success" className="bg-green-500">Ativo</Badge>
                  ) : (
                    <Badge variant="destructive">Inativo</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoverPapel(user.usuarioId)}
                          disabled={removerPapel.isPending}
                          className="opacity-70 group-hover:opacity-100 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Remover papel deste usuário
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default PapelUsuarios;
