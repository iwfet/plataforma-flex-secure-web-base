
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getRouteByPath, isPathMatch } from '@/config/routes';
import { PUBLIC_ROUTES } from '@/constants/routes';
import { clearAuthData } from '@/utils/authUtils';

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;

  // Não renderiza nada enquanto verifica autenticação
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  // Se não houver usuário autenticado, redireciona para login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verifica se a rota atual é uma rota pública autenticada
  const isPublicAuthRoute = PUBLIC_ROUTES.some(route =>
    route.path === currentPath || isPathMatch(route.path, currentPath)
  );

  if (isPublicAuthRoute) {
    return <>{children}</>;
  }


  // Primeiro tentar match exato
  let currentRoute = getRouteByPath(user.telasPermitidas, currentPath);

  // Se não encontrar match exato, tente verificar cada rota permitida para ver se a URL atual corresponde a um padrão
  if (!currentRoute) {
    const permittedRoute = user.telasPermitidas.find(tela =>
      isPathMatch(tela.path, currentPath)
    );

    // Tente também nas subtelas se não encontrou nas telas principais
    if (!permittedRoute) {
      const routeWithSubtela = user.telasPermitidas.find(tela =>
        tela.subtelas?.some(subtela => isPathMatch(subtela.path, currentPath))
      );

      if (routeWithSubtela) {
        const matchingSubtela = routeWithSubtela.subtelas.find(subtela =>
          isPathMatch(subtela.path, currentPath)
        );

        if (matchingSubtela && matchingSubtela.ativo) {
          return <>{children}</>;
        }
      }
    } else if (permittedRoute.ativo) {
      return <>{children}</>;
    }
  } else if (currentRoute) {
    // Se encontrou a rota e o usuário tem acesso, mostra o conteúdo
    const userHasAccess = user.telasPermitidas.some(tela => {
      // Verifica na tela principal
      if (tela.id === currentRoute?.id && tela.ativo) {
        return true;
      }

      // Verifica nas subtelas recursivamente
      function checkSubtelas(subtelas) {
        if (!subtelas || subtelas.length === 0) return false;
        return subtelas.some(subtela =>
          (subtela.id === currentRoute?.id && subtela.ativo) || checkSubtelas(subtela.subtelas)
        );
      }

      return checkSubtelas(tela.subtelas);
    });

    if (userHasAccess) {
      return <>{children}</>;
    }
  }

  // Se a rota não existe ou o usuário não tem permissão, redireciona para dashboard
  console.warn(`Usuário tentou acessar rota não autorizada: ${currentPath}`);
  return <Navigate to="/dashboard" replace />;
};

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Não renderiza nada enquanto verifica autenticação
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  // Se há um usuário autenticado, redireciona para o dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
