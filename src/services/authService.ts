import {useNavigate} from "react-router-dom";
import {useMessage} from "@/contexts/MessageContext";
import {
    clearAuthData,
    getRefreshToken,
    removeRefreshToken,
    setRefreshToken,
    setToken,
    setUser,
} from "@/utils/authUtils";
import apiClient from "@/api/http.ts";
import {useAuthApi} from "@/api/endpoints/auth.ts";
import {LoginRequest} from "@/types";
import {useDeviceData} from "@/hooks/useDeviceInfo";

export const useAuthService = () => {
    const {showSuccess, showError} = useMessage();
    const navigate = useNavigate();
    const authApi = useAuthApi();
    const {deviceId} = useDeviceData();

    const login = async (data: LoginRequest) => {
        try {
            const response = await authApi.login(data);

            if (!response || !response.accessToken || !response.user) {
                showError("Falha na autenticação. Verifique suas credenciais.");
                return null;
            }

            const {accessToken, refreshToken, user} = response;

            setToken(accessToken);
            setRefreshToken(refreshToken);
            setUser(user);

            apiClient.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
            showSuccess("Login realizado com sucesso!");
            return user;
        } catch (error) {
            console.error("Erro no login:", error);
            const errorMessage = error?.response?.data?.message || "Falha no login. Verifique suas credenciais.";
            showError(errorMessage);
            return null;
        }
    };

    const logout = async () => {
        try {
            try {
                await authApi.logout(deviceId);
            } catch (error) {
                console.warn("Erro ao fazer logout no servidor:", error);
            } finally {
                clearAuthData();
                delete apiClient.defaults.headers.common["Authorization"];
                showSuccess("Sessão encerrada com sucesso");
                navigate("/login");
            }
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
            showError("Ocorreu um erro ao encerrar a sessão");
        }finally {
            clearAuthData();
            navigate("/login");
        }
    };

    const forgotPassword = async (email: string, dispositivoInfo: string) => {
        try {
            await authApi.forgotPassword(email, dispositivoInfo);
            showSuccess("Link de redefinição de senha enviado para seu email");
            return true;
        } catch (error) {
            console.error("Erro ao solicitar redefinição de senha:", error);
            showError(error?.response?.data?.message || "Erro ao solicitar redefinição de senha");
            return false;
        }
    }

    const resetPassword = async (token: string, password: string) => {
        try {
            await authApi.resetPassword(token, password);
            showSuccess("Senha redefinida com sucesso");
            return true;
        } catch (error) {
            console.error("Erro ao redefinir senha:", error);
            showError(error?.response?.data?.message || "Erro ao redefinir senha");
            return false;
        }
    }

    const refreshToken = async (deviceId: string) => {
        try {
            const storedRefreshToken = getRefreshToken();


            if (!storedRefreshToken) {
                console.warn("Nenhum refresh token disponível");
                throw new Error("No refresh token available");
            }

            const response = await authApi.refreshToken(storedRefreshToken, deviceId);

            if (!response || !response.accessToken) {
                throw new Error("Falha ao atualizar o token");
            }

            const {accessToken, refreshToken: newRefreshToken, user} = response;


            // Primeiro removemos o refresh token antigo (antes de salvar o novo)
            removeRefreshToken();

            // Depois salvamos os novos tokens
            setToken(accessToken);
            setRefreshToken(newRefreshToken);
            setUser(user);

            apiClient.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
            return accessToken;
        } catch (error) {
            console.error("Erro ao atualizar token:", error);
            // Não fazemos logout aqui, deixamos o interceptor decidir
            throw error;
        }
    };

    return {
        login,
        logout,
        forgotPassword,
        resetPassword,
        refreshToken,
    };
};
