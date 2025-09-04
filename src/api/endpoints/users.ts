
import { useApiClient } from '../http';
import { UserDTO, CreateUserDTO, UpdateUserDTO, ChangePasswordDTO, PapelDTO } from '@/types/user';

export const usersApi = {
    list: async (): Promise<UserDTO[]> => {
        const api = useApiClient();
        return api.get('/v1/usuarios');
    },

    get: async (id: number): Promise<UserDTO> => {
        const api = useApiClient();
        return api.get(`/v1/usuarios/${id}`);
    },

    create: async (data: CreateUserDTO): Promise<UserDTO> => {
        const api = useApiClient();
        return api.post('/v1/usuarios', data);
    },

    update: async (id: number, data: UpdateUserDTO): Promise<UserDTO> => {
        const api = useApiClient();
        return api.patch(`/v1/usuarios/${id}`, data);
    },

    changePassword: async (id: number, data: { newPassword: string }): Promise<void> => {
        const api = useApiClient();
        return api.post(`/v1/usuarios/${id}/change-password`, data);
    },

    listRoles: async (): Promise<PapelDTO[]> => {
        const api = useApiClient();
        return api.get('/v1/papeis');
    }
};
