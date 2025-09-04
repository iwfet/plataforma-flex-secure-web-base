
import React from 'react';
import { UserDTO } from '@/types/user';
import {
    Card,
    CardContent
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface UsersListProps {
    users: UserDTO[];
    selectedUserId: number | null;
    onSelectUser: (id: number) => void;
}

export const UsersList: React.FC<UsersListProps> = ({
    users,
    selectedUserId,
    onSelectUser,
}) => {
    return (
        <Card>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Papel</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow
                                key={user.id}
                                className={`cursor-pointer ${
                                    selectedUserId === user.id ? 'bg-muted' : ''
                                }`}
                                onClick={() => onSelectUser(user.id)}
                            >
                                <TableCell>{user.nomeUsuario}</TableCell>
                                <TableCell>{user.papelNome}</TableCell>
                                <TableCell>
                                    <Badge variant={user.ativo ? "default" : "secondary"}>
                                        {user.ativo ? 'Ativo' : 'Inativo'}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};
