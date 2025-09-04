
import React, { useState } from 'react';
import { TelaResponse } from '@/api/endpoints/telas';
import { cn } from '@/lib/utils';
import { ChevronRight, ChevronDown, FolderIcon, File } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TelasTreeProps {
  telas: TelaResponse[];
  onSelectTela: (id: number) => void;
  selectedTelaId: number | null;
  level?: number;
}

export const TelasTree: React.FC<TelasTreeProps> = ({ 
  telas, 
  onSelectTela, 
  selectedTelaId,
  level = 0 
}) => {
  const [expandedTelas, setExpandedTelas] = useState<number[]>([]);

  const toggleExpand = (id: number) => {
    setExpandedTelas(prev => 
      prev.includes(id) 
        ? prev.filter(telaId => telaId !== id)
        : [...prev, id]
    );
  };

  if (telas.length === 0) {
    return <div className="text-gray-500 text-sm p-2">Nenhuma tela encontrada</div>;
  }

  return (
    <div className="space-y-1">
      {telas.map(tela => (
        <div key={tela.id} className="select-none">
          <div 
            className={cn(
              "flex items-center py-1.5 px-2 rounded-md hover:bg-gray-100 cursor-pointer",
              selectedTelaId === tela.id && "bg-gray-100"
            )}
            style={{ paddingLeft: `${(level * 12) + 8}px` }}
          >
            {tela.subtelas && tela.subtelas.length > 0 ? (
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 p-0 hover:bg-transparent mr-1"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(tela.id);
                }}
              >
                {expandedTelas.includes(tela.id) ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </Button>
            ) : (
              <span className="w-6"></span>
            )}
            
            <div 
              className="flex items-center gap-2 flex-1"
              onClick={() => onSelectTela(tela.id)}
            >
              {tela.subtelas && tela.subtelas.length > 0 ? (
                <FolderIcon size={16} className="text-amber-500" />
              ) : (
                <File size={16} className="text-blue-500" />
              )}
              <span className="truncate">{tela.nomeTela}</span>
            </div>
          </div>

          {/* Render subtelas if expanded */}
          {expandedTelas.includes(tela.id) && tela.subtelas && tela.subtelas.length > 0 && (
            <TelasTree 
              telas={tela.subtelas}
              onSelectTela={onSelectTela}
              selectedTelaId={selectedTelaId}
              level={level + 1}
            />
          )}
        </div>
      ))}
    </div>
  );
};
