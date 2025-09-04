
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, signOut } = useAuth();


  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Painel de Controle</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Olá, {user?.nomeUsuario}</span>
            <Button variant="outline" onClick={signOut}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Bem-vindo!</CardTitle>
              <CardDescription>
                Você está logado como {user?.papel}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                Suas telas permitidas:
              </p>
              <div className="space-y-2">
                {user?.telasPermitidas.map((tela) => (
                  <Link
                    key={tela.id}
                    to={tela.path}
                    className="block p-2 rounded hover:bg-blue-50 transition-colors"
                  >
                    <div className="font-medium text-blue-600">{tela.nomeTela}</div>
                    <div className="text-sm text-gray-500">{tela.descricao}</div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
