
import {AuthResponse, CustomRequestConfig, LoginRequest} from '@/types';
import {useApiClient} from "@/api/http.ts";


interface ForgotPasswordResponse {
    success: boolean;
    message: string;
}

interface ResetPasswordResponse {
    success: boolean;
    message: string;
}

interface LogoutResponse {
    success: boolean;
    message: string;
}

export const useAuthApi = () => {
    const api = useApiClient();
    const config: CustomRequestConfig = { skipAuthRefresh: true };

    return {
        login: (data: LoginRequest) =>
            api.post<AuthResponse>('/v1/auth/login', data,config),

        logout: (deviceId: string) =>
            api.post<LogoutResponse>('/v1/auth/logout', { deviceId }, config),

        forgotPassword: (email: string,dispositivoInfo: string) =>
            api.post<ForgotPasswordResponse>('/v1/auth/password-reset/request',{email,dispositivoInfo}),

        resetPassword: (token: string, novaSenha: string) =>
            api.post<ResetPasswordResponse>('/v1/auth/password-reset/reset', {token, novaSenha}),

        refreshToken: (refreshToken: string, deviceId: string) =>
            api.post<AuthResponse>('/v1/auth/refresh', { refreshToken, deviceId }, config),
    };
};
