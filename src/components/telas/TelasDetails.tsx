
import React from 'react';
import { TelaResponse } from '@/api/endpoints/telas';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { Edit, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TelaDetalhes } from '@/components/telas/TelaDetalhes';
import { TelaEndpoints } from '@/components/telas/TelaEndpoints';

interface TelasDetailsProps {
  selectedTela: TelaResponse | undefined;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

export const TelasDetails: React.FC<TelasDetailsProps> = ({
  selectedTela,
  onEditClick,
  onDeleteClick,
}) => {
  return (
    <Card className="md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>{selectedTela ? selectedTela.nomeTela : 'Detalhes da Tela'}</CardTitle>
          <CardDescription>
            {selectedTela ? selectedTela.descricao : 'Selecione uma tela para ver detalhes'}
          </CardDescription>
        </div>
        {selectedTela && (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onEditClick}
              className="flex items-center gap-1"
            >
              <Edit className="h-4 w-4" />
              <span>Editar</span>
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={onDeleteClick}
              className="flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
              <span>Excluir</span>
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {selectedTela ? (
          <Tabs defaultValue="detalhes">
            <TabsList className="mb-4">
              <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
              <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            </TabsList>
            <TabsContent value="detalhes">
              <TelaDetalhes tela={selectedTela} />
            </TabsContent>
            <TabsContent value="endpoints">
              <TelaEndpoints telaId={selectedTela.id} />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center p-6 text-gray-500">
            Selecione uma tela para visualizar seus detalhes
          </div>
        )}
      </CardContent>
    </Card>
  );
};
