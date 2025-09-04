
import React from 'react';
import { UserDTO, CreateUserDTO, UpdateUserDTO } from '@/types/user';
import { CreateUserForm } from './forms/CreateUserForm';
import { UpdateUserForm } from './forms/UpdateUserForm';

interface UserDetailsProps {
    user: UserDTO | null;
    onSave: (data: CreateUserDTO) => void;
    onUpdate: (data: { id: number; data: UpdateUserDTO }) => void;
    isCreating: boolean;
    isUpdating: boolean;
}

export const UserDetails: React.FC<UserDetailsProps> = ({
    user,
    onSave,
    onUpdate,
    isCreating,
    isUpdating,
}) => {
    if (!user) {
        return <CreateUserForm onSave={onSave} isCreating={isCreating} />;
    }

    return (
        <UpdateUserForm
            user={user}
            onUpdate={onUpdate}
            isUpdating={isUpdating}
        />
    );
};
