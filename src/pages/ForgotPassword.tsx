import {useCallback, useState} from 'react';
import {Link} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {useAuth} from '../contexts/AuthContext';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Label} from '@/components/ui/label';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';

const forgotSchema = z.object({
    email: z.string().email('Digite um email válido'),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

const ForgotPassword = () => {
    const { forgotPassword, isLoading } = useAuth();

    const [emailSent, setEmailSent] = useState(false);

    const {register, handleSubmit, formState: {errors}} = useForm<ForgotFormData>({
        resolver: zodResolver(forgotSchema),
        defaultValues: {
            email: '',
        },
    });

    const onSubmit = async (data: ForgotFormData) => {
        await forgotPassword(data.email, () => {
            setEmailSent(true)
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Recuperar Senha</CardTitle>
                    <CardDescription className="text-center">
                        Informe seu email para receber o link de recuperação
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {emailSent ? (
                        <div className="text-center space-y-4">
                            <div className="bg-green-50 text-green-700 p-4 rounded-md">
                                Email de recuperação enviado com sucesso! Verifique sua caixa de entrada.
                            </div>
                            <Link
                                to="/login"
                                className="text-blue-600 hover:underline inline-block"
                            >
                                Voltar para o login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="seu.email@exemplo.com"
                                    {...register('email')}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500">{errors.email.message}</p>
                                )}
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
                            </Button>

                            <div className="text-center">
                                <Link
                                    to="/login"
                                    className="text-blue-600 hover:underline"
                                >
                                    Voltar para o login
                                </Link>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ForgotPassword;
