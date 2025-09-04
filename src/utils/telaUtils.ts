
import { TelaResponse } from "@/api/endpoints/telas";

/**
 * Verifica se definir um novo pai para uma tela criaria um ciclo na hierarquia
 * @param telaId ID da tela que está sendo atualizada
 * @param novoPaiId ID do novo pai que se deseja definir
 * @param todasTelas Array com todas as telas do sistema
 * @returns true se um ciclo seria criado, false caso contrário
 */
export const verificaCicloHierarquia = (
  telaId: number,
  novoPaiId: number | null,
  todasTelas: TelaResponse[]
): boolean => {
  // Se o novo pai for null, não há como criar um ciclo
  if (novoPaiId === null) return false;
  
  // Se o novo pai for igual ao ID da própria tela, é um ciclo direto
  if (novoPaiId === telaId) return true;
  
  // Função para buscar uma tela pelo ID
  const encontraTela = (id: number): TelaResponse | undefined => 
    todasTelas.find(t => t.id === id) || 
    todasTelas.flatMap(t => t.subtelas || []).find(t => t?.id === id);
  
  // Verifica se a tela que está sendo modificada é um ancestral do novo pai
  const verificaSeEhAncestral = (paiAtualId: number): boolean => {
    // Se chegamos na tela que está sendo modificada, encontramos um ciclo
    if (paiAtualId === telaId) return true;
    
    // Busca o pai atual no array de telas
    const paiAtual = encontraTela(paiAtualId);
    
    // Se o pai atual não tem pai, chegamos ao topo da hierarquia sem encontrar um ciclo
    if (!paiAtual || paiAtual.telaPaiId === null) return false;
    
    // Continua verificando com o pai do pai atual
    return verificaSeEhAncestral(paiAtual.telaPaiId);
  };
  
  // Inicia a verificação a partir do novo pai
  return verificaSeEhAncestral(novoPaiId);
};

