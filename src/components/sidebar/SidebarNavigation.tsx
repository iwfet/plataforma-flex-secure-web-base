
import React, { useState } from 'react';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarMenuItem } from './SidebarMenuItem';
import { PUBLIC_ROUTES } from '@/constants/routes';
import { SidebarSubMenu } from './SidebarSubMenu';
import { TelaPermitida } from '@/types';

export const SidebarNavigation = () => {
  const { user } = useAuth();
  const { state } = useSidebar();
  const [openSubmenus, setOpenSubmenus] = useState<number[]>([]);

  // Filter main routes (routes without a parent)
  const userMainRoutes = user?.telasPermitidas.filter(tela => !tela.telaPaiId) || [];
  
  // Combine user routes with public routes and sort by order
  const allRoutes = [
    ...userMainRoutes,
    ...PUBLIC_ROUTES
  ].sort((a, b) => (a.ordem || 0) - (b.ordem || 0));

  const toggleSubmenu = (id: number) => {
    setOpenSubmenus(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <SidebarGroup>
      {state !== 'collapsed' && <SidebarGroupLabel className="px-4">Navegação</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {allRoutes.map((route: TelaPermitida) => {
            const routeKey = `nav-${route.id}-${route.path}`;
            return (
              <React.Fragment key={routeKey}>
                <SidebarMenuItem
                  tela={route}
                  hasSubmenus={route.subtelas && route.subtelas.length > 0}
                  isSubmenuOpen={openSubmenus.includes(route.id)}
                  onToggleSubmenu={() => toggleSubmenu(route.id)}
                />
                {(route.subtelas && route.subtelas.length > 0 && openSubmenus.includes(route.id)) && (
                  <>
                    <SidebarMenuItem
                      tela={{
                        ...route,
                        id: `${route.id}-clone` as unknown as number,
                        telaPaiId: route.id,
                        descricao: route.descricao,
                        ativo: route.ativo
                      }}
                      level={1}
                      isClone={true}
                    />
                    <SidebarSubMenu 
                      subtelas={route.subtelas} 
                      isOpen={true}
                      parentId={route.id}
                    />
                  </>
                )}
              </React.Fragment>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
