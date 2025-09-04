
import axios, {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import {getToken, setToken} from "@/utils/authUtils.ts";
import {CustomRequestConfig} from "@/types";

interface ApiError {
    failedReason?:string
    message: string;
    error: string;
    statusCode: number;
}

const isProduction = import.meta.env.MODE === 'production';
const API_URL = isProduction ? 'https://vipdogpet.com.br/api' : 'http://localhost:5000/api'

const apiClient: AxiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 15000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

export const setupApiInterceptors = (
    logout: () => void,
    showError: (message: string) => void,
    refreshToken: () => Promise<string | null>,
) => {
    let isRefreshing = false;
    let failedQueue: {
        resolve: (value: AxiosResponse | null) => void;
        reject: (error: unknown) => void;
    }[] = [];

    const processQueue = (error: unknown | null, response: AxiosResponse | null = null) => {
        failedQueue.forEach(prom => {
            if (error) {
                prom.reject(error);
            } else {
                prom.resolve(response);
            }
        });
        failedQueue = [];
    };

    apiClient.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
            const originalRequest = error.config! as CustomRequestConfig;
            const status = error.response?.status || 0;
            const apiError = error.response?.data as ApiError;

            if (originalRequest.skipAuthRefresh) {
                return Promise.reject(error);
            }

            if (status === 401 && ['Token expirado','token expired'].includes(apiError?.message)) {
                if (!isRefreshing) {
                    isRefreshing = true;
                    refreshToken()
                        .then(newToken => {
                            if (newToken) {
                                processQueue(null, error.response);
                            } else {
                                processQueue(new Error('Failed to refresh token'));
                                logout();
                            }
                        })
                        .catch(err => {
                            processQueue(err, null);
                            logout();
                        })
                        .finally(() => {
                            isRefreshing = false;
                        });
                }

                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (response) => {
                            if (response) {
                                originalRequest.headers!['Authorization'] = `Bearer ${getToken()}`;
                                resolve(apiClient(originalRequest));
                            } else {
                                reject(new Error('Failed to refresh token'));
                            }
                        },
                        reject,
                    });
                });
            }

            if (!error.response) {
                showError('Erro de conexão. Verifique sua internet.');
                return Promise.reject(error);
            }

            if ((status === 401 || status === 403)) {
                showError('Sua sessão expirou. Por favor, faça login novamente.');
                logout();
                return Promise.reject(error);
            }

            if (apiError?.message) {
                const errorMessage = apiError.message
                    ? `${apiError.message}: ${apiError.error || apiError.failedReason || ''}`
                    : apiError.message;

                showError(errorMessage);
                return Promise.reject(error);
            }

            if (status >= 500) {
                showError('Erro no servidor. Tente novamente mais tarde.');
            } else {
                showError(`Erro ${status}: Falha na requisição`);
            }

            return Promise.reject(error);
        }
    );

    apiClient.interceptors.request.use(
        (config) => {
            const token = getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );
}

export const useApiClient = () => {
    const token = getToken();
    if (token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    const authRequest = async <T>(config: AxiosRequestConfig): Promise<T> => {
        const currentToken = getToken();
        if (currentToken) {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${currentToken}`,
            };
        }

        const response = await apiClient(config);
        return response.data;
    };

    return {
        get: <T>(url: string, config: AxiosRequestConfig = {}): Promise<T> =>
            authRequest<T>({...config, method: 'get', url}),
        post: <T>(url: string, data?: any, config: AxiosRequestConfig = {}): Promise<T> =>
            authRequest<T>({...config, method: 'post', url, data}),
        put: <T>(url: string, data?: any, config: AxiosRequestConfig = {}): Promise<T> =>
            authRequest<T>({...config, method: 'put', url, data}),
        patch: <T>(url: string, data?: any, config: AxiosRequestConfig = {}): Promise<T> =>
            authRequest<T>({...config, method: 'patch', url, data}),
        delete: <T>(url: string, config: AxiosRequestConfig = {}): Promise<T> =>
            authRequest<T>({...config, method: 'delete', url}),
    };
}

export default apiClient;
