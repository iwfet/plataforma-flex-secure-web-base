
import { User, Settings } from 'lucide-react';

export const PUBLIC_ROUTES = [
  {
    id: 'profile',
    path: '/profile',
    nomeTela: 'Perfil',
    descricao: 'Informações do usuário',
    icon: User
  },
  {
    id: 'settings',
    path: '/settings',
    nomeTela: 'Configurações',
    descricao: 'Configurações do sistema',
    icon: Settings
  }
];
