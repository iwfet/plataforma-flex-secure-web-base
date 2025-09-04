
import React from 'react';
import { TelaPermitida } from '@/types';
import { SidebarMenuItem } from './SidebarMenuItem';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

interface SidebarSubMenuProps {
  subtelas: TelaPermitida[];
  isOpen: boolean;
  parentId?: number | string;
}

export const SidebarSubMenu = ({ subtelas, isOpen, parentId }: SidebarSubMenuProps) => {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  if (!isOpen || !subtelas.length || isCollapsed) return null;

  return (
    <div className={cn(
      "transition-all duration-200",
      "pl-4 space-y-1"
    )}>
      {subtelas.map((subtela) => (
        <SidebarMenuItem
          key={`submenu-${parentId}-${subtela.id}`}
          tela={subtela}
          level={1}
        />
      ))}
    </div>
  );
};
