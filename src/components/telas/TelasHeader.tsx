
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TelasHeaderProps {
  onCreateClick: () => void;
}

export const TelasHeader: React.FC<TelasHeaderProps> = ({ onCreateClick }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Gerenciamento de Telas</h1>
      <Button 
        onClick={onCreateClick} 
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        <span>Nova Tela</span>
      </Button>
    </div>
  );
};
