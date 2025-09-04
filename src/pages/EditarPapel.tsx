
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import PapelForm from '@/components/papeis/forms/PapelForm';
import { usePapeisManager } from '@/hooks/usePapeisManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PapelPermissoes from '@/components/papeis/PapelPermissoes';
import PapelUsuarios from '@/components/papeis/PapelUsuarios';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Shield, Users, Lock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PapelDTO } from '@/types/papeis';

const EditarPapel = () => {
  const { id } = useParams<{ id: string }>();
  const papelId = id ? parseInt(id) : 0;
  const navigate = useNavigate();
  const { getPapel, updatePapel } = usePapeisManager();
  const { data: papel, isLoading, isError, error } = getPapel(papelId);
  const [activeTab, setActiveTab] = useState('detalhes');

  console.log('EditarPapel rendering with ID:', id, 'Parsed ID:', papelId);
  console.log('Papel data:', papel, 'Is Loading:', isLoading, 'Is Error:', isError, 'Error:', error);

  useEffect(() => {
    if (isError) {
      console.error('Error loading papel:', error);
      // Stay on the page to show error state instead of immediately redirecting
    }
  }, [isError, error]);

  const handleSubmit = (values: any) => {
    updatePapel.mutate(
      { id: papelId, data: values },
      {
        onSuccess: () => {
          setActiveTab('permissoes');
        },
      }
    );
  };

  // Show dedicated loading state
  if (isLoading) {
    return (
      <div className="container px-4 py-6 mx-auto">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/papeis')}
            className="mr-3"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="h-10 w-10 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="ml-3 space-y-2">
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-48 bg-gray-100 rounded animate-pulse"></div>
          </div>
        </div>
        
        <Card className="shadow-sm">
          <div className="p-6 flex flex-col items-center justify-center h-64">
            <div className="h-12 w-12 rounded-full border-4 border-t-primary border-r-transparent border-b-primary border-l-transparent animate-spin mb-4"></div>
            <p className="text-muted-foreground">Carregando detalhes do papel...</p>
          </div>
        </Card>
      </div>
    );
  }

  // Show error state with option to go back
  if (isError || !papel) {
    return (
      <div className="container px-4 py-6 mx-auto">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="bg-red-100 p-3 rounded-full mb-4">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Não foi possível carregar o papel</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            O papel com ID {papelId} não foi encontrado ou ocorreu um erro ao carregar suas informações.
            {error instanceof Error && (
              <span className="block mt-2 text-sm text-red-500">{error.message}</span>
            )}
          </p>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate('/papeis')}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Voltar para a lista
            </Button>
            <Button onClick={() => window.location.reload()}>
              Tentar novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Type assertion to ensure papel is treated as PapelDTO
  const typedPapel = papel as PapelDTO;

  return (
    <div className="container px-4 py-6 mx-auto">
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/papeis')}
            className="mr-3"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <div className="bg-primary/10 h-10 w-10 rounded-md flex items-center justify-center mr-3">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{typedPapel.nomePapel}</h1>
              <Badge variant="outline" className="bg-primary/10">
                ID: {typedPapel.id}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {typedPapel.descricao}
            </p>
          </div>
        </div>
        
        <Separator />
        
        <Card className="shadow-sm">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b px-4">
              <TabsList className="h-14 bg-transparent">
                <TabsTrigger value="detalhes" className="data-[state=active]:bg-primary/10">
                  Detalhes
                </TabsTrigger>
                <TabsTrigger value="permissoes" className="data-[state=active]:bg-primary/10">
                  <Lock className="h-4 w-4 mr-2" />
                  Permissões
                </TabsTrigger>
                <TabsTrigger value="usuarios" className="data-[state=active]:bg-primary/10">
                  <Users className="h-4 w-4 mr-2" />
                  Usuários
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="p-6">
              <TabsContent value="detalhes" className="m-0">
                <PapelForm
                  papel={typedPapel}
                  onSubmit={handleSubmit}
                  isSubmitting={updatePapel.isPending}
                />
              </TabsContent>
              
              <TabsContent value="permissoes" className="m-0">
                <PapelPermissoes papelId={papelId} />
              </TabsContent>
              
              <TabsContent value="usuarios" className="m-0">
                <PapelUsuarios papelId={papelId} />
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default EditarPapel;
