
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  LayoutGrid, 
  FileBarChart,
  UserPlus,
  PenSquare,
  ShieldPlus,
  ShieldCheck
} from 'lucide-react';

export const defaultIcons: Record<number, React.ComponentType> = {
  1: LayoutDashboard,  // Dashboard
  2: Users,            // Usuários
  3: Shield,          // Papéis
  4: LayoutGrid,      // Telas
  5: FileBarChart,    // Relatórios
  6: UserPlus,        // Criar Usuário
  7: PenSquare,       // Editar Usuário
  8: ShieldPlus,      // Criar Papel
  9: ShieldCheck      // Editar Papel
};
