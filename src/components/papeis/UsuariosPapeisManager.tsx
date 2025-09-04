
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useUsuarioPapelManager } from '@/hooks/useUsuarioPapelManager';
import { usersApi } from '@/api/endpoints/users';
import { usePapeisManager } from '@/hooks/usePapeisManager';
import { Users } from 'lucide-react';
import AtribuicaoPapelForm from './AtribuicaoPapelForm';
import AtribuicoesPapelTable from './AtribuicoesPapelTable';
import SearchAtribuicoes from './SearchAtribuicoes';

const UsuariosPapeisManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedPapelId, setSelectedPapelId] = useState<string>('');
  
  const { listarAtribuicoes, atribuirPapel, removerPapel } = useUsuarioPapelManager();
  
  const { data: usuarios = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: usersApi.list,
  });
  
  const { papeis } = usePapeisManager();
  
  const { data: atribuicoes = [], isLoading: isLoadingAtribuicoes } = listarAtribuicoes;

  const usuariosDisponiveis = usuarios.filter(
    user => !atribuicoes.some(atribuicao => atribuicao.usuarioId === user.id)
  );

  const handleAtribuir = () => {
    if (selectedUserId && selectedPapelId) {
      atribuirPapel.mutate({
        usuarioId: parseInt(selectedUserId),
        papelId: parseInt(selectedPapelId)
      });
      setSelectedUserId('');
      setSelectedPapelId('');
    }
  };

  const handleRemover = (usuarioId: number) => {
    removerPapel.mutate(usuarioId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-medium">Atribuição de Papéis aos Usuários</h2>
      </div>
      
      <AtribuicaoPapelForm
        selectedUserId={selectedUserId}
        setSelectedUserId={setSelectedUserId}
        selectedPapelId={selectedPapelId}
        setSelectedPapelId={setSelectedPapelId}
        usuariosDisponiveis={usuariosDisponiveis}
        papeis={papeis}
        handleAtribuir={handleAtribuir}
        atribuirPapelMutation={atribuirPapel}
      />
      
      <SearchAtribuicoes 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      
      <AtribuicoesPapelTable
        atribuicoes={atribuicoes}
        isLoading={isLoadingAtribuicoes}
        handleRemover={handleRemover}
        removerPapelMutation={removerPapel}
        searchTerm={searchTerm}
      />
    </div>
  );
};

export default UsuariosPapeisManager;
