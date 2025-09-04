
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { SidebarNavigation } from './sidebar/SidebarNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User } from 'lucide-react';
import { Button } from './ui/button';

const AppSidebar = () => {
  const { user, signOut } = useAuth();
  const { state } = useSidebar();

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="border-b px-2 py-2">
        <SidebarTrigger className="ml-auto" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarNavigation />
      </SidebarContent>
      {user && (
        <SidebarFooter className="border-t p-2">
          <div className={`flex ${state === 'collapsed' ? 'flex-col items-center' : 'items-center justify-between'} gap-2`}>
            <div className="flex items-center space-x-2">
              <User size={18} className="text-gray-600 shrink-0" />
              <span className={`text-sm font-medium truncate transition-all duration-200 ${state === 'collapsed' ? 'hidden' : 'block'}`}>
                {user.nomeUsuario}
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={signOut}
              className={`h-8 w-8 p-0 ${state === 'collapsed' ? 'mt-2' : ''}`}
              title="Sair"
            >
              <LogOut size={18} className="text-gray-600" />
            </Button>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
};

export default AppSidebar;
