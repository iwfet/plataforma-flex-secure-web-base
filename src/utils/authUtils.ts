
// Token storage key
import { User } from "@/types";
import {STORAGE_KEY} from "@/hooks/useDeviceInfo.ts";

const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';
const REMEMBER_EMAL ='rememberEmail';

// Get token from localStorage
export const getToken = (): string | null => {
    try {
        return localStorage.getItem(TOKEN_KEY);
    } catch (error) {
        console.error("Error accessing localStorage:", error);
        return null;
    }
};

// Set token in localStorage
export const setToken = (token: string): void => {
    try {
        if (!token) {
            console.warn("Attempting to store empty token");
            return;
        }
        localStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
        console.error("Error setting token in localStorage:", error);
    }
};

// Get refresh token from localStorage
export const getRefreshToken = (): string | null => {
    try {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
        console.error("Error accessing localStorage:", error);
        return null;
    }
};

// Set refresh token in localStorage
export const setRefreshToken = (token: string): void => {
    try {
        if (!token) {
            console.warn("Attempting to store empty refresh token");
            return;
        }
        localStorage.setItem(REFRESH_TOKEN_KEY, token);
    } catch (error) {
        console.error("Error setting refresh token in localStorage:", error);
    }
};

export const getRememberEmail = (): string | null => {
    try {
        return localStorage.getItem(REMEMBER_EMAL);
    } catch (error) {
        console.error("Error accessing localStorage:", error);
        return null;
    }
};

export const setRememberEmail = (email: string): void => {
    try {
        localStorage.setItem(REMEMBER_EMAL, email);
    } catch (error) {
        console.error("Error setting email in localStorage:", error);
    }
};

export const removeRememberEmail = (): void => {
    try {
        localStorage.removeItem(REMEMBER_EMAL);
    } catch (error) {
        console.error("Error removing email from localStorage:", error);
    }
};

export const removeUser = (): void => {
    try {
        localStorage.removeItem(USER_KEY);
    } catch (error) {
        console.error("Error removing user from localStorage:", error);
    }
};

export const removeRefreshToken = (): void => {
    try {
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch (error) {
        console.error("Error removing refresh token from localStorage:", error);
    }
};

export const removeToken = (): void => {
    try {
        localStorage.removeItem(TOKEN_KEY);
    } catch (error) {
        console.error("Error removing token from localStorage:", error);
    }
};
const  removeDeviceInfo = (): void => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error("Error removing token from localStorage:", error);
    }

}

export const clearAuthData = (): void => {
    try {
        removeDeviceInfo()
        removeToken();
        removeRefreshToken();
        removeUser();
    } catch (error) {
        console.error("Error clearing auth data from localStorage:", error);
    }
};

export const getUser = (): User | null => {
    try {
        const userJson = localStorage.getItem(USER_KEY);
        if (!userJson) return null;
        return JSON.parse(userJson);
    } catch (error) {
        console.error("Error parsing user JSON:", error);
        return null;
    }
};

// Set user in storage
export const setUser = (user: User): void => {
    try {
        if (!user) {
            console.warn("Attempting to store null user");
            return;
        }
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
        console.error("Error setting user in localStorage:", error);
    }
};

export const isAuthenticated = (): boolean => {
    try {
        const token = getToken();
        const user = getUser();

        if (!token || !user) {
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error checking authentication:", error);
        return false;
    }
};
