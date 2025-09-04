
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Shield } from 'lucide-react';

const PapeisHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div className="flex items-center">
        <div className="bg-primary/10 h-12 w-12 rounded-md flex items-center justify-center mr-4">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Papéis de Acesso</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configuração de perfis e permissões do sistema
          </p>
        </div>
      </div>
      <Button 
        onClick={() => navigate('/papeis/novo')}
        className="shadow-sm"
      >
        <Plus className="mr-2 h-4 w-4" />
        Novo Papel
      </Button>
    </div>
  );
};

export default PapeisHeader;
