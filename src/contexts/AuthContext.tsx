
import React, {createContext, useCallback, useContext, useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {useAuthState} from "@/hooks/useAuthState.ts";
import {useMessage} from "@/contexts/MessageContext.tsx";
import {setupApiInterceptors} from "@/api";
import {clearAuthData, getRefreshToken, getToken, getUser, isAuthenticated, setRefreshToken, setToken, setUser} from '@/utils/authUtils';
import {isPublicRoute} from "@/utils/routeUtils.ts";
import {useDeviceData} from "@/hooks/useDeviceInfo.ts";
import {useAuthService} from "@/services/authService.ts";
import {LoginRequest, User} from "@/types";
import apiClient from '@/api/http';
import { useQuery } from '@tanstack/react-query';

interface AuthContextData {
    user: User | null;
    isLoading: boolean;
    signIn: (email: string, senha: string) => Promise<void>;
    signOut: () => void;
    forgotPassword: (email: string, setEmailSent: () => void) => Promise<void>;
    resetPassword: (token: string, senha: string, setResetSuccess: () => void) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({children}: { children: React.ReactNode }) {
    const {
        user, setUserState,
        isLoading, setIsLoading
    } = useAuthState();
    const location = useLocation();
    const navigate = useNavigate();
    const {showError} = useMessage();
    const {deviceId, deviceInfo} = useDeviceData();
    const {login, forgotPassword:perForgotPassword, resetPassword:perResetPassword, refreshToken: authServiceRefreshToken, logout: authServiceLogout} = useAuthService();
    const [authChecked, setAuthChecked] = useState(false);

    const fetchUserScreens = async () => {
        try {
            const response = await apiClient.get('/v1/auth/profile');
            if (response?.data) {
                const updatedUser = {
                    ...user,
                    telasPermitidas: response.data.telasPermitidas
                };
                setUser(updatedUser);
                setUserState(updatedUser);
            }
        } catch (error) {
            console.error('Erro ao atualizar telas permitidas:', error);
        }
    };

    useQuery({
        queryKey: ['userScreens'],
        queryFn: fetchUserScreens,
        enabled: !!user,
        refetchInterval: 5 * 60 * 1000,
        refetchOnWindowFocus: true,
    });

    useEffect(() => {
        const handleLogout = () => {
            // Tenta fazer logout no servidor antes de limpar dados locais
            authServiceLogout().catch(() => {
                // Se falhar o logout no servidor, ainda limpa localmente
                setUserState(null);
                clearAuthData();
            });
            
            if (!isPublicRoute(location.pathname)) {
                navigate("/login", {replace: true});
            }
        };

        const refreshAuthToken = async () => {
            try {
                return await authServiceRefreshToken(deviceId);
            } catch (error) {
                console.error("Error refreshing token:", error);
                if (error?.response?.status === 401) {
                    handleLogout();
                }
                return null;
            }
        };

        setupApiInterceptors(handleLogout, showError, refreshAuthToken);
    }, [location.pathname, showError, setUserState, navigate, deviceId, authServiceRefreshToken, authServiceLogout]);

    useEffect(() => {
        const checkAndLoadAuth = async () => {
            if (authChecked) return;

            try {
                setIsLoading(true);
                const storedToken = getToken();
                const storedUser = getUser();

                if (storedToken && storedUser && isAuthenticated()) {
                    setUserState(storedUser);
                    apiClient.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;

                } else if (!isPublicRoute(location.pathname)) {
                    clearAuthData();
                    navigate('/login', { replace: true });
                }
            } catch (error) {
                console.error("Error checking authentication:", error);
                if (!isPublicRoute(location.pathname)) {
                    clearAuthData();
                    navigate('/login', { replace: true });
                }
            } finally {
                setIsLoading(false);
                setAuthChecked(true);
            }
        };

        checkAndLoadAuth();
    }, [authChecked, location.pathname, navigate, setIsLoading, setUserState]);

    const signIn = useCallback(async (email: string, senha: string) => {
        setIsLoading(true);
        console.log(deviceInfo)
        const data = {
            email,
            senha,
            deviceInfo: deviceInfo
        } as unknown as LoginRequest

        try {
            const user = await login(data);
            if (user) {
                setUserState(user);
                navigate('/dashboard');
            }
        } finally {
            setIsLoading(false);
        }
    }, [deviceId, deviceInfo, login, navigate, setIsLoading, setUserState]);

    const signOut = useCallback(() => {
        authServiceLogout();
    }, [authServiceLogout]);

    const forgotPassword = useCallback(async (email: string, setEmailSent: () => void) => {
        setIsLoading(true);
        const result = await perForgotPassword(email, JSON.stringify(deviceInfo)).finally(() => setIsLoading(false));
        if (result) {
            setEmailSent();
        }
    }, [deviceInfo, perForgotPassword, setIsLoading]);

    const resetPassword = useCallback(async (token: string, password: string, setResetSuccess: () => void) => {
        setIsLoading(true);
        const result = await perResetPassword(token, password).finally(() => setIsLoading(false));
        if (result) {
            setResetSuccess();
        }
    }, [perResetPassword, setIsLoading]);

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            signIn,
            signOut,
            forgotPassword,
            resetPassword
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
