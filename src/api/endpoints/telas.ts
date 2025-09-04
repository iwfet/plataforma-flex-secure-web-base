import {useApiClient} from "@/api";


export interface Endpoint {
  id: number;
  endpoint: string;
  telaId: number;
  method: string;
  description: string;
}

export interface TelaResponse {
  id: number;
  nomeTela: string;
  path: string;
  descricao: string;
  ativo: boolean;
  ordem: number;
  telaPaiId: number | null;
  icone: string | null;
  subtelas: TelaResponse[];
  endpoints?: Endpoint[];
}

export interface TelaRequest {
  nomeTela: string;
  path: string;
  descricao: string;
  ativo: boolean;
  ordem?: number;
  telaPaiId?: number | null;
  icone?: string | null;
}

export const useTelasApi = () => {
  const apiClient = useApiClient();

  return {
    listarTelas: async (): Promise<TelaResponse[]> => {
      return apiClient.get('/v1/telas');
    },

    obterTela: async (id: number): Promise<TelaResponse> => {
      return apiClient.get(`/v1/telas/${id}`);
    },

    criarTela: async (tela: TelaRequest): Promise<TelaResponse> => {
      return apiClient.post('/v1/telas', tela);
    },

    atualizarTela: async (id: number, tela: TelaRequest): Promise<TelaResponse> => {
      return apiClient.patch<TelaResponse>(`/v1/telas/${id}`, tela);
    },

    excluirTela: async (id: number): Promise<void> => {
      return apiClient.delete(`/v1/telas/${id}`);
    },

    listarSubtelas: async (id: number): Promise<TelaResponse[]> => {
      return apiClient.get(`/v1/telas/${id}/subtelas`);
    },

    moverTela: async (id: number, novoPaiId: number | null): Promise<TelaResponse> => {
      return apiClient.patch(`/v1/telas/${id}/mover-para/${novoPaiId ?? 'null'}`);
    },

    reordenarSubtelas: async (id: number, ordemIds: number[]): Promise<TelaResponse[]> => {
      return apiClient.post(`/v1/telas/${id}/reordenar-subtelas`, { ordemIds });
    },

    listarEndpoints: async (telaId: number): Promise<Endpoint[]> => {
      return apiClient.get(`/v1/telas/${telaId}/endpoints`);
    },

    adicionarEndpoint: async (telaId: number, endpoint: Omit<Endpoint, 'id'>): Promise<Endpoint> => {
      return apiClient.post(`/v1/telas/${telaId}/endpoints`, endpoint);
    },

    removerEndpoint: async (telaId: number, endpointId: number): Promise<void> => {
      return apiClient.delete(`/v1/telas/${telaId}/endpoints/${endpointId}`);
    }
  };
};

export const telasApi = useTelasApi();
