import Dashboard from "@/pages/Dashboard";
import TelasGerenciamento from "@/pages/TelasGerenciamento";
import { ComponentType } from "react";
import { TelaPermitida } from "@/types";
import UsersManagement from "@/pages/UsersManagement.tsx";
import ChangePassword from "@/pages/ChangePassword";
import DeviceSessions from "@/pages/DeviceSessions.tsx";
import PapeisManagement from "@/pages/PapeisManagement";
import NovoPapel from "@/pages/NovoPapel";
import EditarPapel from "@/pages/EditarPapel";

export interface PrivateRouteConfig {
    id: number;
    path: string;
    component: ComponentType;
    name: string;
}

const componentMap: Record<number, ComponentType> = {
    1: Dashboard,
    2: UsersManagement,
    3: PapeisManagement,
    4: TelasGerenciamento,

    6: DeviceSessions,
    7: ChangePassword,

    // Subtelas de Papéis
    8: NovoPapel,
    9: EditarPapel,

    // Subtelas de Relatórios
    5: Dashboard,
    18: Dashboard,
    19: Dashboard,

    // Subtelas de Configurações
    10: Dashboard,
    15: Dashboard,
    16: Dashboard,
    17: Dashboard,

    // Outras telas
    11: Dashboard,                    // Perfil
    12: Dashboard,                    // Notificações
    13: Dashboard,                    // Logs de Auditoria
    14: Dashboard,                    // Ajuda

};

// Helper function to normalize paths (remove trailing slashes, normalize parameters)
export const normalizePath = (path: string): string => {
    // Remove trailing slash if it exists
    let normalizedPath = path.endsWith('/') ? path.slice(0, -1) : path;

    // Replace any path parameters like :id with a regex pattern for comparison
    return normalizedPath.replace(/\/:[^/]+/g, '/[^/]+');
};

// Helper function to check if a URL matches a route pattern
export const isPathMatch = (routePath: string, urlPath: string): boolean => {
    // Convert route pattern to regex
    // Replace :param with a regex group that matches anything except slashes
    const routeRegexString = routePath
        .replace(/:[^/]+/g, '[^/]+')
        .replace(/\//g, '\\/');

    const routeRegex = new RegExp(`^${routeRegexString}$`);

    return routeRegex.test(urlPath);
};

export const getPrivateRoutes = (telasPermitidas: TelaPermitida[]): PrivateRouteConfig[] => {
    // Criamos um Set para rastrear caminhos já processados
    const processedPaths = new Set<string>();
    const routes: PrivateRouteConfig[] = [];

    // Function to process a tela and its subtelas recursively
    function processTela(tela: TelaPermitida) {
        if (!tela.ativo) return;

        // Add the main screen if not processed yet
        if (!processedPaths.has(tela.path)) {
            processedPaths.add(tela.path);
            routes.push({
                id: tela.id,
                path: tela.path,
                component: componentMap[tela.id] || Dashboard,
                name: tela.nomeTela
            });
        }

        // Process all subtelas recursively
        if (tela.subtelas && tela.subtelas.length > 0) {
            tela.subtelas.forEach(subtela => processTela(subtela));
        }
    }

    // Start processing all top-level telas
    telasPermitidas.forEach(tela => processTela(tela));

    return routes;
};

export const getRouteById = (telasPermitidas: TelaPermitida[], id: number): PrivateRouteConfig | undefined => {
    // Function to find a tela by ID recursively
    function findTelaById(telas: TelaPermitida[], targetId: number): TelaPermitida | undefined {
        for (const tela of telas) {
            if (tela.id === targetId) {
                return tela;
            }

            if (tela.subtelas && tela.subtelas.length > 0) {
                const found = findTelaById(tela.subtelas, targetId);
                if (found) return found;
            }
        }

        return undefined;
    }

    const tela = findTelaById(telasPermitidas, id);
    if (!tela) return undefined;

    return {
        id: tela.id,
        path: tela.path,
        component: componentMap[tela.id] || Dashboard,
        name: tela.nomeTela
    };
};

export const getRouteByPath = (telasPermitidas: TelaPermitida[], path: string): PrivateRouteConfig | undefined => {
    // Normalize the path we're looking for
    const normalizedPath = path.split('?')[0].split('#')[0];

    // Function to find a tela by path recursively, supporting path parameters
    function findTelaByPath(telas: TelaPermitida[], targetPath: string): TelaPermitida | undefined {
        for (const tela of telas) {
            // Check if the path matches directly or if it's a route with parameters
            if (tela.path === targetPath || isPathMatch(tela.path, targetPath)) {
                return tela;
            }

            if (tela.subtelas && tela.subtelas.length > 0) {
                const found = findTelaByPath(tela.subtelas, targetPath);
                if (found) return found;
            }
        }

        return undefined;
    }

    const tela = findTelaByPath(telasPermitidas, normalizedPath);
    if (!tela) return undefined;

    return {
        id: tela.id,
        path: tela.path,
        component: componentMap[tela.id] || Dashboard,
        name: tela.nomeTela
    };
};
