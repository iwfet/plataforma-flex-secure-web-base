
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { usersApi } from '@/api/endpoints/users';
import { useLoading } from '@/contexts/LoadingContext';
import { useToast } from '@/hooks/use-toast';
import { useMessage } from "@/contexts/MessageContext.tsx";
import { getUser } from '@/utils/authUtils';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
import { Key, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const passwordSchema = z.object({
    newPassword: z.string()
        .min(6, 'A nova senha deve ter no mínimo 6 caracteres')
        .max(50, 'A nova senha deve ter no máximo 50 caracteres'),
    confirmPassword: z.string()
        .min(6, 'A confirmação de senha deve ter no mínimo 6 caracteres')
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

const ChangePassword = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { showSuccess, showError } = useMessage();
    const { onLoadingStart, onLoadingEnd } = useLoading();
    
    const [userId, setUserId] = useState<string | null>(null);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [strengthText, setStrengthText] = useState('');

    useEffect(() => {
        // If no ID in params, try to get current user ID from localStorage
        if (!id) {
            const currentUser = getUser();
            if (currentUser && currentUser.id) {
                setUserId(String(currentUser.id));
            } else {
                showError('ID de usuário não encontrado');
                navigate('/usuarios');
            }
        } else {
            setUserId(id);
        }
    }, [id, navigate, showError]);

    const form = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            newPassword: '',
            confirmPassword: '',
        },
    });

    const calculatePasswordStrength = (password: string) => {
        if (!password) return 0;
        
        let strength = 0;
        
        // Length check
        if (password.length >= 8) strength += 20;
        else if (password.length >= 6) strength += 10;
        
        // Contains lowercase
        if (/[a-z]/.test(password)) strength += 20;
        
        // Contains uppercase
        if (/[A-Z]/.test(password)) strength += 20;
        
        // Contains numbers
        if (/[0-9]/.test(password)) strength += 20;
        
        // Contains special characters
        if (/[^A-Za-z0-9]/.test(password)) strength += 20;
        
        return Math.min(100, strength);
    };

    const getStrengthLabel = (strength: number) => {
        if (strength < 20) return 'Muito fraca';
        if (strength < 40) return 'Fraca';
        if (strength < 60) return 'Média';
        if (strength < 80) return 'Boa';
        return 'Forte';
    };
    
    const getStrengthColor = (strength: number) => {
        if (strength < 30) return 'bg-red-500';
        if (strength < 60) return 'bg-yellow-500';
        return 'bg-green-600';
    };

    // Watch for password changes to update strength
    useEffect(() => {
        const subscription = form.watch((value, { name }) => {
            if (name === 'newPassword' || name === undefined) {
                const newStrength = calculatePasswordStrength(value.newPassword || '');
                setPasswordStrength(newStrength);
                setStrengthText(getStrengthLabel(newStrength));
            }
        });
        
        return () => subscription.unsubscribe();
    }, [form.watch]);

    const changePasswordMutation = useMutation({
        mutationFn: (data: { newPassword: string }) => {
            if (!userId) throw new Error('ID do usuário não fornecido');
            onLoadingStart();
            return usersApi.changePassword(parseInt(userId), data);
        },
        onSuccess: () => {
            showSuccess('Senha alterada com sucesso');
            navigate('/usuarios');
        },
        onError: (error: Error) => {
            showError(`Erro ao alterar senha: ${error.message}`);
        },
        onSettled: () => {
            onLoadingEnd();
        },
    });

    const onSubmit = (data: PasswordFormValues) => {
        const payload = {
            newPassword: data.newPassword
        };
        
        changePasswordMutation.mutate(payload);
    };

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6">
                <Button 
                    variant="outline" 
                    onClick={() => navigate('/usuarios')}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar para Usuários
                </Button>
            </div>

            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5" />
                        Alterar Senha do Usuário
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nova Senha</FormLabel>
                                        <div className="relative">
                                            <FormControl>
                                                <Input 
                                                    type={showNewPassword ? "text" : "password"} 
                                                    placeholder="Digite a nova senha" 
                                                    {...field} 
                                                />
                                            </FormControl>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-0 top-0 h-full px-3"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                            >
                                                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                        <FormMessage />
                                       
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirmar Nova Senha</FormLabel>
                                        <div className="relative">
                                            <FormControl>
                                                <Input 
                                                    type={showConfirmPassword ? "text" : "password"} 
                                                    placeholder="Confirme a nova senha" 
                                                    {...field} 
                                                />
                                            </FormControl>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-0 top-0 h-full px-3"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                        <FormMessage />
                                         
                                        <div className="mt-2">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs text-gray-500">Força da senha:</span>
                                                <span className="text-xs font-medium">{strengthText}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full transition-all duration-300 ${getStrengthColor(passwordStrength)}`} 
                                                    style={{ width: `${passwordStrength}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <Button 
                                type="submit" 
                                className="w-full"
                                disabled={changePasswordMutation.isPending}
                            >
                                {changePasswordMutation.isPending ? 'Alterando...' : 'Alterar Senha'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ChangePassword;
