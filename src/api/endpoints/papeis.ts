import { useApiClient } from '../http';
import { PapelDTO, TelaPermitidaDTO, NovoPapelDTO, AtualizaPapelDTO } from '@/types/papeis';

export const papeisApi = {
    list: async (): Promise<PapelDTO[]> => {
        const api = useApiClient();
        console.log('Calling API to list papeis');
        try {
            const result = await api.get('/v1/papeis');
            console.log('API returned papel list:', result);
            return result;
        } catch (error) {
            console.error('Failed to list papeis:', error);
            throw error;
        }
    },

    get: async (id: number): Promise<PapelDTO> => {
        const api = useApiClient();
        console.log(`Calling API to fetch papel with id ${id}`);
        try {
            const result = await api.get(`/v1/papeis/${id}`);
            console.log(`API returned papel ${id}:`, result);
            return result;
        } catch (error) {
            console.error(`Failed to get papel with id ${id}:`, error);
            throw error;
        }
    },

    create: async (data: NovoPapelDTO): Promise<PapelDTO> => {
        const api = useApiClient();
        console.log('Creating new papel with data:', data);
        try {
            const result = await api.post('/v1/papeis', data);
            console.log('API created papel:', result);
            return result;
        } catch (error) {
            console.error('Failed to create papel:', error);
            throw error;
        }
    },

    update: async (id: number, data: AtualizaPapelDTO): Promise<PapelDTO> => {
        const api = useApiClient();
        console.log(`Updating papel ${id} with data:`, data);
        try {
            const result = await api.patch(`/v1/papeis/${id}`, data);
            console.log(`API updated papel ${id}:`, result);
            return result;
        } catch (error) {
            console.error(`Failed to update papel with id ${id}:`, error);
            throw error;
        }
    },

    delete: async (id: number): Promise<void> => {
        const api = useApiClient();
        console.log(`Deleting papel ${id}`);
        try {
            await api.delete(`/v1/papeis/${id}`);
            console.log(`API deleted papel ${id}`);
        } catch (error) {
            console.error(`Failed to delete papel with id ${id}:`, error);
            throw error;
        }
    },

    addPermissao: async (papelId: number, telaId: number): Promise<void> => {
        const api = useApiClient();
        return api.post(`/v1/papeis/${papelId}/telas/${telaId}`);
    },

    removePermissao: async (papelId: number, telaId: number): Promise<void> => {
        const api = useApiClient();
        return api.delete(`/v1/papeis/${papelId}/telas/${telaId}`);
    },

    listPermissoes: async (papelId: number): Promise<TelaPermitidaDTO[]> => {
        const api = useApiClient();
        try {
            return await api.get(`/v1/papeis/${papelId}/permissoes`);
        } catch (error) {
            console.error(`Failed to list permissoes for papel ${papelId}:`, error);
            throw error;
        }
    }
};
