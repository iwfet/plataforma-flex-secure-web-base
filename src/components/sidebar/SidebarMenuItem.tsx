
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  SidebarMenuItem as BaseSidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import { ChevronDown, ChevronRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { TelaPermitida } from '@/types';
import { defaultIcons } from './icons';
import { cn } from '@/lib/utils';

interface MenuItemProps {
  tela: TelaPermitida;
  hasSubmenus?: boolean;
  isSubmenuOpen?: boolean;
  onToggleSubmenu?: () => void;
  level?: number;
  isClone?: boolean;
}

export const SidebarMenuItem = ({
  tela,
  hasSubmenus,
  isSubmenuOpen,
  onToggleSubmenu,
  level = 0,
  isClone = false
}: MenuItemProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();
  const { id, path, nomeTela, descricao, icone } = tela;

  const isActive = location.pathname === path;
  const isCollapsed = state === 'collapsed';

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (hasSubmenus && !isClone) {
      if (onToggleSubmenu && !isCollapsed) {
        onToggleSubmenu();
      }
      return;
    }

    if (path) {
      navigate(path);
    }
  };

  const renderIcon = () => {
    if (id && defaultIcons[id as number]) {
      const DefaultIcon = defaultIcons[id as number];
      return <DefaultIcon  />;
    }

    if (!icone) return null;

    if (typeof icone === 'string' && icone.startsWith('http')) {
      return <img src={icone} alt=""  />;
    }

    if (typeof icone === 'string') {
      const iconName = icone.includes('-')
        ? icone
            .split('-')
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join('')
        : icone.charAt(0).toUpperCase() + icone.slice(1);

      const IconComponent = (LucideIcons )[iconName];

      if (IconComponent) {
        return <IconComponent  />;
      }
    }

    return null;
  };

  const uniqueId = `${id.toString()}-${isClone ? 'clone' : 'original'}-${level}`;

  return (
    <BaseSidebarMenuItem
      isActive={isActive}
      className={cn(
        level > 0 ? 'pl-4' : '',
        isActive && 'bg-primary/5'
      )}
    >
      <SidebarMenuButton
        onClick={handleClick}
        tooltip={isCollapsed ? nomeTela : undefined}
        isActive={isActive}
        className={cn(
          "justify-between group transition-all",
          isClone && "font-semibold bg-muted/50",
          level > 0 && "text-sm",
          hasSubmenus && !isClone && "cursor-pointer",
          isActive && "bg-primary/10 text-primary",
          isCollapsed && "p-2 h-9"
        )}
      >
        <div className="flex items-center gap-2">
          {renderIcon()}
          <span className={cn(
            "transition-all duration-200",
            isCollapsed && "opacity-0 w-0"
          )}>{nomeTela}</span>
        </div>
        {hasSubmenus && !isClone && !isCollapsed && (
          <div className="ml-2">
            {isSubmenuOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </div>
        )}
      </SidebarMenuButton>
    </BaseSidebarMenuItem>
  );
};
