
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useMessage } from "@/contexts/MessageContext.tsx";
import { Eye, EyeOff } from 'lucide-react';

const resetSchema = z.object({
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type ResetFormData = z.infer<typeof resetSchema>;

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const { resetPassword, isLoading } = useAuth();
  const { showError } = useMessage();
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [strengthText, setStrengthText] = useState('');

  const { register, handleSubmit, formState: { errors }, watch } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ResetFormData) => {
    if (!token){
      showError("Token não encontrado");
    } else {
      await resetPassword(token, data.password, () => setResetSuccess(true));
    }
  };

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
    const subscription = watch((value) => {
      const newStrength = calculatePasswordStrength(value.password || '');
      setPasswordStrength(newStrength);
      setStrengthText(getStrengthLabel(newStrength));
    });
    
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Redefinir Senha</CardTitle>
          <CardDescription className="text-center">
            Digite sua nova senha
          </CardDescription>
        </CardHeader>
        <CardContent>
          {resetSuccess ? (
            <div className="text-center space-y-4">
              <div className="bg-green-50 text-green-700 p-4 rounded-md">
                Sua senha foi redefinida com sucesso!
              </div>
              <Link
                to="/login"
                className="text-blue-600 hover:underline inline-block"
              >
                Ir para o login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nova Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    {...register('password')}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
                
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirme a Senha</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="********"
                    {...register('confirmPassword')}
                  />
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
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Redefinindo...' : 'Redefinir Senha'}
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

export default ResetPassword;
