
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/api/endpoints/users';
import { useLoading } from '@/contexts/LoadingContext';
import { useMessage } from "@/contexts/MessageContext.tsx";
import { CreateUserDTO, UpdateUserDTO } from '@/types/user';

export const useUsersManager = () => {
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const { onLoadingStart, onLoadingEnd } = useLoading();
    const { showSuccess, showError } = useMessage();
    const queryClient = useQueryClient();

    const { data: users = [], isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            onLoadingStart();
            try {
                return await usersApi.list();
            } catch (error) {
                showError("Erro ao carregar usuários: " + (error as Error).message);
                return [];
            } finally {
                onLoadingEnd();
            }
        }
    });

    const selectedUser = users.find(user => user.id === selectedUserId) ?? null;

    const createMutation = useMutation({
        mutationFn: (data: CreateUserDTO) => usersApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            showSuccess("Usuário criado com sucesso");
        },
        onError: (error: Error) => {
            showError(`Erro ao criar usuário: ${error.message}`);
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateUserDTO }) => 
            usersApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            showSuccess("Usuário atualizado com sucesso");
        },
        onError: (error: Error) => {
            showError(`Erro ao atualizar usuário: ${error.message}`);
        }
    });

    return {
        users,
        isLoading,
        selectedUser,
        setSelectedUserId,
        createUser: createMutation.mutate,
        updateUser: updateMutation.mutate,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
    };
};
