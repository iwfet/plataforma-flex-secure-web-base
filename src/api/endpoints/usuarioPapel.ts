
import { useApiClient } from '../http';
import { UserDTO } from '@/types/user';
import { PapelDTO } from '@/types/papeis';

export interface UsuarioPapelDTO {
  id: number;
  usuarioId: number;
  papelId: number;
  usuario?: UserDTO;
  papel?: PapelDTO;
  nomeUsuario: string;
  nomePapel: string;
}

export interface AtribuirPapelDTO {
  usuarioId: number;
  papelId: number;
}

export const usuarioPapelApi = {
  atribuirPorParametros: async (usuarioId: number, papelId: number): Promise<void> => {
    const api = useApiClient();
    return api.post(`/v1/usuario-papel/${usuarioId}/papel/${papelId}`);
  },

  atribuirPorBody: async (data: AtribuirPapelDTO): Promise<void> => {
    const api = useApiClient();
    return api.post('/v1/usuario-papel/atribuir', data);
  },

  removerPapel: async (usuarioId: number): Promise<void> => {
    const api = useApiClient();
    return api.delete(`/v1/usuario-papel/${usuarioId}/papel`);
  },

  listarUsuariosPorPapel: async (papelId: number): Promise<UserDTO[]> => {
    const api = useApiClient();
    return api.get(`/v1/usuario-papel/usuarios/${papelId}`);
  },

  buscarPapelDoUsuario: async (usuarioId: number): Promise<PapelDTO> => {
    const api = useApiClient();
    return api.get(`/v1/usuario-papel/papel/${usuarioId}`);
  },

  listarAtribuicoes: async (): Promise<UsuarioPapelDTO[]> => {
    const api = useApiClient();
    return api.get('/v1/usuario-papel');
  }
};
