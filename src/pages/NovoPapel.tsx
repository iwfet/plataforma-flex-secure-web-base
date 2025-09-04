
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PapelForm from '@/components/papeis/forms/PapelForm';
import { usePapeisManager } from '@/hooks/usePapeisManager';
import { ChevronLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NovoPapel = () => {
  const navigate = useNavigate();
  const { createPapel } = usePapeisManager();

  const handleSubmit = (values: any) => {
    createPapel.mutate(values, {
      onSuccess: () => {
        navigate('/papeis');
      },
    });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
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
        <h1 className="text-xl font-bold">Novo Perfil de Acesso</h1>
      </div>
      
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Informações do Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <PapelForm
            onSubmit={handleSubmit}
            isSubmitting={createPapel.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default NovoPapel;
