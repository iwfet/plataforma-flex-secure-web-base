
import React from 'react';
import { TelaResponse } from '@/api/endpoints/telas';
import { Badge } from '@/components/ui/badge';
import * as LucideIcons from 'lucide-react';

interface TelaDetalhesProps {
  tela: TelaResponse;
}

export const TelaDetalhes: React.FC<TelaDetalhesProps> = ({ tela }) => {
  const renderIcone = () => {
    if (!tela.icone) return null;

    const iconName = tela.icone.charAt(0).toUpperCase() + tela.icone.slice(1);
    const IconComponent = (LucideIcons as any)[iconName];
    
    if (IconComponent) {
      return <IconComponent size={24} className="text-gray-700" />;
    }
    
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {renderIcone()}
        <div>
          <h3 className="text-xl font-semibold">{tela.nomeTela}</h3>
          <p className="text-gray-600">{tela.descricao}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">Path</p>
          <p className="font-mono bg-gray-100 p-1 rounded">{tela.path}</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">Status</p>
          <div>
            {tela.ativo ? (
              <Badge variant="success" className="bg-green-500">Ativo</Badge>
            ) : (
              <Badge variant="destructive">Inativo</Badge>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">ID</p>
          <p>{tela.id}</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">Ordem</p>
          <p>{tela.ordem || 'Não definida'}</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">Tela Pai</p>
          <p>{tela.telaPaiId ? `ID: ${tela.telaPaiId}` : 'Tela principal'}</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">Ícone</p>
          <p>{tela.icone || 'Nenhum'}</p>
        </div>
      </div>

      {tela.subtelas && tela.subtelas.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-md font-semibold">Subtelas ({tela.subtelas.length})</h3>
          <ul className="list-disc list-inside pl-2 space-y-1">
            {tela.subtelas.map(subtela => (
              <li key={subtela.id} className="text-sm">
                {subtela.nomeTela} {!subtela.ativo && <span className="text-gray-400">(inativa)</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
