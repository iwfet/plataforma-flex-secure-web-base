import React from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import * as z from 'zod';
import {CreateUserDTO, PapelDTO} from '@/types/user';
import {useMessage} from "@/contexts/MessageContext.tsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Switch} from '@/components/ui/switch';
import {usersApi} from '@/api/endpoints/users';
import {useQuery} from '@tanstack/react-query';

const createSchema = z.object({
    nomeUsuario: z.string().min(1, 'Nome é obrigatório'),
    email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
    senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    ativo: z.boolean(),
    admin: z.boolean(),
    papelId: z.number({ required_error: "Selecione um papel." }).int(),
});

interface CreateUserFormProps {
    onSave: (data: CreateUserDTO) => void;
    isCreating: boolean;
}

export const CreateUserForm: React.FC<CreateUserFormProps> = ({
                                                                  onSave,
                                                                  isCreating,
                                                              }) => {
    const {showSuccess, showError} = useMessage();
    const form = useForm<CreateUserDTO>({
        resolver: zodResolver(createSchema),
        defaultValues: {
            nomeUsuario: '',
            email: '',
            senha: '',
            ativo: true,
            admin: false,
            papelId: undefined,
        },
    });

    const {data: roles = [], error: rolesError} = useQuery({
        queryKey: ['roles'],
        queryFn: usersApi.listRoles
    });

    React.useEffect(() => {
        if (rolesError) {
            showError("Erro ao carregar papéis: " + (rolesError as Error).message);
        }
    }, [rolesError, showError]);

    const handleSubmit = async (data: CreateUserDTO) => {
        try {
            console.log(data)
            await onSave(data);
            showSuccess("Usuário criado com sucesso!");
            form.reset();
        } catch (error) {
            showError("Erro ao criar usuário: " + (error as Error).message);
        }
    };
    console.log(form)

    return (
        <Card>
            <CardHeader>
                <CardTitle>Novo Usuário</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="nomeUsuario"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Nome</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="senha"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Senha</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="papelId"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Papel</FormLabel>
                                    <Select
                                        onValueChange={(value) => field.onChange(value ? parseInt(value, 10) : null)}
                                        value={field.value ? String(field.value) : ""}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione um papel"/>
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
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="ativo"
                            render={({field}) => (
                                <FormItem
                                    className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
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
                        <FormField
                            control={form.control}
                            name="admin"
                            render={({field}) => (
                                <FormItem
                                    className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>Administrador</FormLabel>
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
                        <Button type="submit" disabled={isCreating}>
                            {isCreating ? 'Criando...' : 'Criar Usuário'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};
