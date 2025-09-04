
import React, { useState } from 'react';
import { usePapeisManager } from '@/hooks/usePapeisManager';
import { useQuery } from '@tanstack/react-query';
import { papeisApi } from '@/api/endpoints/papeis';
import { telasApi } from '@/api/endpoints/telas';
import { TelaPermitidaDTO } from '@/types/papeis';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowDown, ArrowUp, Check, Ban, Loader2, Shield, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface PapelPermissoesProps {
  papelId: number;
}

const PapelPermissoes = ({ papelId }: PapelPermissoesProps) => {
  const { addPermissao, removePermissao } = usePapeisManager();
  const [expandedTelas, setExpandedTelas] = useState<number[]>([]);

  // Buscar todas as telas disponíveis
  const { data: allTelas, isLoading: telasLoading } = useQuery({
    queryKey: ['telas'],
    queryFn: telasApi.listarTelas,
  });

  // Buscar as permissões do papel
  const { data: permissoes, isLoading: permissoesLoading } = useQuery({
    queryKey: ['papel', papelId, 'permissoes'],
    queryFn: () => papeisApi.listPermissoes(papelId),
    enabled: !!papelId,
  });

  const handlePermissaoChange = (telaId: number, checked: boolean) => {
    if (checked) {
      addPermissao.mutate({ papelId, telaId });
    } else {
      removePermissao.mutate({ papelId, telaId });
    }
  };

  const toggleExpand = (telaId: number) => {
    setExpandedTelas((prev) =>
      prev.includes(telaId)
        ? prev.filter((id) => id !== telaId)
        : [...prev, telaId]
    );
  };

  const isPermitido = (telaId: number): boolean => {
    return permissoes?.some((p) => p.telaId === telaId) || false;
  };

  const getPermissionsCount = () => {
    if (!allTelas || !permissoes) return { total: 0, active: 0 };
    
    // Conta recursivamente todas as telas disponíveis
    const countAllTelas = (telas: any[]): number => {
      return telas.reduce((count, tela) => {
        return count + 1 + (tela.subtelas ? countAllTelas(tela.subtelas) : 0);
      }, 0);
    };
    
    const totalTelas = countAllTelas(allTelas);
    return {
      total: totalTelas,
      active: permissoes.length,
      percentage: Math.round((permissoes.length / totalTelas) * 100)
    };
  };

  const renderTela = (tela: TelaPermitidaDTO, level = 0) => {
    const hasSubtelas = tela.subtelas && tela.subtelas.length > 0;
    const isExpanded = expandedTelas.includes(tela.id);
    const isAllowed = isPermitido(tela.id);

    return (
      <React.Fragment key={tela.id}>
        <div
          className={`flex items-center justify-between p-3 border-b transition-colors ${
            level > 0 ? 'pl-' + (level * 6 + 3) : ''
          } ${isAllowed ? 'bg-green-50/30' : ''} 
            ${level > 0 && level % 2 === 0 ? 'bg-muted/20' : ''} 
            hover:bg-muted/40`}
        >
          <div className="flex items-center gap-3 flex-1">
            {hasSubtelas ? (
              <button
                onClick={() => toggleExpand(tela.id)}
                className="p-1 rounded-sm hover:bg-muted flex items-center justify-center"
                aria-label={isExpanded ? "Recolher" : "Expandir"}
              >
                {isExpanded ? (
                  <ArrowDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ArrowUp className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            ) : (
              <span className="w-6 flex justify-center">
                {tela.icone ? (
                  <div className="bg-primary/10 h-6 w-6 rounded flex items-center justify-center">
                    <Shield className="h-3 w-3 text-primary" />
                  </div>
                ) : (
                  <span className="w-4" />
                )}
              </span>
            )}
            <div className="flex-1">
              <div className="font-medium flex items-center">
                {tela.nomeTela}
                <Badge variant="outline" className="ml-2 text-xs">
                  ID: {tela.id}
                </Badge>
                {!tela.ativo && (
                  <Badge variant="outline" className="ml-2 text-xs text-muted-foreground">Inativa</Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground flex items-center mt-1">
                <span className="text-xs font-mono bg-muted/40 px-1 py-0.5 rounded mr-2">{tela.path}</span>
                {tela.descricao}
              </div>
            </div>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center">
                  <div className="mr-2 text-xs text-muted-foreground">
                    {isAllowed ? (
                      <Badge variant="outline" className="bg-green-100/30 text-green-700 border-green-200">
                        <Check className="h-3 w-3 mr-1" /> Permitido
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-50/30 text-red-600 border-red-100">
                        <Ban className="h-3 w-3 mr-1" /> Bloqueado
                      </Badge>
                    )}
                  </div>
                  <Switch
                    checked={isAllowed}
                    onCheckedChange={(checked) =>
                      handlePermissaoChange(tela.id, checked)
                    }
                    disabled={addPermissao.isPending || removePermissao.isPending}
                    className={isAllowed ? "data-[state=checked]:bg-green-600" : ""}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isAllowed ? 'Remover' : 'Adicionar'} permissão para esta tela</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {hasSubtelas && isExpanded && (
          <>
            {tela.subtelas?.map((subtela) => renderTela(subtela, level + 1))}
          </>
        )}
      </React.Fragment>
    );
  };

  if (telasLoading || permissoesLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p>Carregando permissões...</p>
      </div>
    );
  }

  if (!allTelas) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4 text-red-500 bg-red-50 rounded-md">
        <Shield className="w-12 h-12 mb-2" />
        <p className="font-medium">Erro ao carregar telas</p>
        <p className="text-sm">Tente novamente mais tarde ou contate o suporte.</p>
      </div>
    );
  }
  
  const stats = getPermissionsCount();

  return (
    <div className="space-y-6">
      <div className="bg-muted/10 p-6 rounded-md border">
        <div className="flex items-center justify-between pb-4 border-b">
          <h3 className="text-lg font-semibold flex items-center">
            <div className="bg-primary/10 h-7 w-7 rounded flex items-center justify-center mr-2">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            Permissões de Acesso
          </h3>
          
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">
              {stats.active} de {stats.total} telas permitidas
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Porcentagem de telas com acesso permitido</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <div className="my-4">
          <Progress value={stats.percentage} className="h-2" />
        </div>
        
        <div className="mt-6 border rounded-md overflow-hidden shadow-sm">
          {Array.isArray(allTelas) && allTelas.map((tela) => renderTela(tela as TelaPermitidaDTO))}
        </div>
        
        <div className="flex items-start gap-2 mt-6 p-4 bg-muted/20 rounded-md">
          <Info className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <p className="text-sm text-muted-foreground">
              Ative ou desative o acesso a cada tela do sistema para este papel.
              Telas com subtelas podem ser expandidas para configurar permissões mais granulares.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              <strong>Dica:</strong> Ao permitir acesso a uma tela pai, considere também permitir acesso às subtelas relevantes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PapelPermissoes;
