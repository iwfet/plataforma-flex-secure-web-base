
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

interface UsersHeaderProps {
    onCreateClick: () => void;
}

export const UsersHeader: React.FC<UsersHeaderProps> = ({ onCreateClick }) => {
    return (
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Gerenciamento de Usuários</h1>
            <Button 
                onClick={onCreateClick} 
                className="flex items-center gap-2"
            >
                <UserPlus className="h-4 w-4" />
                <span>Novo Usuário</span>
            </Button>
        </div>
    );
};
