import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UserDTO, UpdateUserDTO, PapelDTO } from '@/types/user';
import { useMessage } from "@/contexts/MessageContext.tsx";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { usersApi } from '@/api/endpoints/users';
import { useQuery } from '@tanstack/react-query';

const updateSchema = z.object({
    nomeUsuario: z.string().min(1, 'Nome é obrigatório'),
    email: z.string().email('Email inválido'),
    papelId: z.number().int().positive('Papel é obrigatório'),
    ativo: z.boolean(),
});

interface UpdateUserFormProps {
    user: UserDTO;
    onUpdate: (data: { id: number; data: UpdateUserDTO }) => void;
    isUpdating: boolean;
}

export const UpdateUserForm: React.FC<UpdateUserFormProps> = ({
    user,
    onUpdate,
    isUpdating,
}) => {
    const { showSuccess, showError } = useMessage();
    const navigate = useNavigate();
    const form = useForm<UpdateUserDTO>({
        resolver: zodResolver(updateSchema),
        defaultValues: {
            nomeUsuario: user.nomeUsuario,
            email: user.email,
            papelId: user.papelId,
            ativo: user.ativo,
        },
    });

    React.useEffect(() => {
        form.reset({
            nomeUsuario: user.nomeUsuario,
            email: user.email,
            papelId: user.papelId,
            ativo: user.ativo,
        });
    }, [user, form]);

    const { data: roles = [], error: rolesError } = useQuery({
        queryKey: ['roles'],
        queryFn: usersApi.listRoles
    });

    React.useEffect(() => {
        if (rolesError) {
            showError("Erro ao carregar papéis: " + (rolesError as Error).message);
        }
    }, [rolesError, showError]);

    const handleSubmit = async (data: UpdateUserDTO) => {
        try {
            await onUpdate({ id: user.id, data });
            showSuccess("Usuário atualizado com sucesso!");
        } catch (error) {
            showError("Erro ao atualizar usuário: " + (error as Error).message);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Editar Usuário</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="nomeUsuario"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="papelId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Papel</FormLabel>
                                    <Select 
                                        onValueChange={(value) => field.onChange(parseInt(value))}
                                        value={String(field.value)}
                                        defaultValue={String(field.value)}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione um papel" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {roles.map((role: PapelDTO) => (
                                                <SelectItem key={role.id} value={String(role.id)}>
                                                    {role.nomePapel}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="ativo"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>Ativo</FormLabel>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <div className="flex flex-col sm:flex-row gap-2">
                            <Button type="submit" disabled={isUpdating} className="flex-1">
                                {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
                            </Button>
                            
                            <Button 
                                type="button" 
                                variant="outline"
                                onClick={() => navigate(`/usuarios/change-password/${user.id}`)}
                                className="flex items-center justify-center gap-2"
                            >
                                <Key className="h-4 w-4" />
                                Alterar Senha
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};
