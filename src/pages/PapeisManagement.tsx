
import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import PapeisList from '@/components/papeis/PapeisList';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Shield, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UsuariosPapeisManager from '@/components/papeis/UsuariosPapeisManager';

const PapeisManagement = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isRootPath = location.pathname === '/papeis';
  const [activeTab, setActiveTab] = useState<string>('papeis');

  return (
    <div className="container px-4 py-6 mx-auto">
      {isRootPath ? (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-start">
              <div className="bg-primary/10 h-12 w-12 rounded-md flex items-center justify-center mr-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Gerenciamento de Segurança</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Administre papéis e atribuições de usuários
                </p>
              </div>
            </div>
            
            {activeTab === 'papeis' && (
              <Button 
                onClick={() => navigate('/papeis/novo')} 
                className="shadow-sm"
              >
                Novo Papel
              </Button>
            )}
          </div>

          <Tabs 
            defaultValue="papeis" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-4">
              <TabsTrigger value="papeis" className="flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Papéis
              </TabsTrigger>
              <TabsTrigger value="atribuicoes" className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Atribuições
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="papeis" className="m-0">
              <Card className="border shadow-sm">
                <CardContent className="p-0">
                  <PapeisList />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="atribuicoes" className="m-0">
              <Card className="border shadow-sm">
                <CardContent className="p-6">
                  <UsuariosPapeisManager />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <Outlet />
      )}
    </div>
  );
};

export default PapeisManagement;
