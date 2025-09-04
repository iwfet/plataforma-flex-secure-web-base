
export interface TelaPermitida {
    id: number;
    nomeTela: string;
    path: string;
    descricao: string;
    ativo: boolean;
    ordem: number;
    telaPaiId: number | null;
    subtelas: TelaPermitida[];
    icone?: string;
}

export interface User {
    id: number;
    nomeUsuario: string;
    papel: "superUser" | "user" | string;
    telasPermitidas: TelaPermitida[];
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
    deviceId?: string;
}

export interface DeviceInfo{
    deviceId?: string;
    deviceName: string;
    plataforma?: string;
    userAgent?: string;
    os?: string;
    browser?: string;
    deviceType?: string;
    language?: string;
    screen?: { width: number, height: number };
}

export interface LoginRequest {
    email: string;
    senha: string;
    deviceInfo: DeviceInfo
}

export interface DeviceSession {
    id: number;
    deviceId: string;
    deviceName: string;
    plataforma?: string;
    ultimoAcesso: string;
    ativo: boolean;
    userAgent?: string;
    os?: string;
    browser?: string;
    deviceType?: string;
    language?: string;
    screenSize?: {
        width: number;
        height: number;
    };
}

import type { AxiosRequestConfig } from 'axios';

export interface CustomRequestConfig extends AxiosRequestConfig {
    skipAuthRefresh?: boolean;
}
