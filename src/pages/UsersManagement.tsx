
import React from 'react';
import { useUsersManager } from '@/hooks/useUsersManager';
import { UsersHeader } from '@/components/users/UsersHeader';
import { UsersList } from '@/components/users/UsersList';
import { UserDetails } from '@/components/users/UserDetails';

const UsersManagement = () => {
    const {
        users,
        selectedUser,
        setSelectedUserId,
        createUser,
        updateUser,
        isCreating,
        isUpdating
    } = useUsersManager();

    return (
        <div className="container mx-auto p-6">
            <UsersHeader onCreateClick={() => setSelectedUserId(null)} />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <UsersList
                    users={users}
                    selectedUserId={selectedUser?.id ?? null}
                    onSelectUser={setSelectedUserId}
                />
                
                <div className="md:col-span-2">
                    <UserDetails
                        user={selectedUser}
                        onSave={createUser}
                        onUpdate={updateUser}
                        isCreating={isCreating}
                        isUpdating={isUpdating}
                    />
                </div>
            </div>
        </div>
    );
};

export default UsersManagement;
