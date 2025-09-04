
import React from 'react';
import { TelaResponse } from '@/api/endpoints/telas';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { TelasTree } from '@/components/telas/TelasTree';

interface TelasTreeSectionProps {
  telas: TelaResponse[];
  selectedTelaId: number | null;
  onSelectTela: (id: number) => void;
}

export const TelasTreeSection: React.FC<TelasTreeSectionProps> = ({
  telas,
  selectedTelaId,
  onSelectTela
}) => {
  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <CardTitle>Estrutura de Telas</CardTitle>
        <CardDescription>Organize e gerencie suas telas</CardDescription>
      </CardHeader>
      <CardContent>
        <TelasTree 
          telas={telas} 
          onSelectTela={onSelectTela}
          selectedTelaId={selectedTelaId}
        />
      </CardContent>
    </Card>
  );
};
