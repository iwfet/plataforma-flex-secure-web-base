
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Perfil do Usuário</h1>
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Informações Pessoais</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Nome do Usuário</Label>
            <p className="text-gray-700">{user?.nomeUsuario}</p>
          </div>
          <div>
            <Label>Papel</Label>
            <p className="text-gray-700">{user?.papel}</p>
          </div>
          <div>
            <Label>ID do Usuário</Label>
            <p className="text-gray-700">{user?.id}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
