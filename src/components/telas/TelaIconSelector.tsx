
import React, { useState } from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from "@/components/ui/scroll-area";
import * as LucideIcons from 'lucide-react';
import { Search } from 'lucide-react';
import { LucideProps } from 'lucide-react';

// Filter only valid icon components
const ALL_ICONS = Object.entries(LucideIcons)
  .filter(([name, component]) => {
    return (
      name !== 'createLucideIcon' && 
      name !== 'default' && 
      typeof component === 'function'
    );
  })
  .map(([name, component]) => ({
    name: name.toLowerCase().replace(/([A-Z])/g, '-$1').replace(/^-/, ''),
    displayName: name,
    component: component
  }));

interface TelaIconSelectorProps {
  control: any;
}

export const TelaIconSelector = ({ control }: TelaIconSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredIcons = ALL_ICONS.filter(icon => 
    icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    icon.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to get icon component from name
  const getIconComponent = (iconName: string | null) => {
    if (!iconName) return null;
    
    // Check if iconName is kebab-case
    if (iconName.includes('-')) {
      // Convert kebab-case to PascalCase
      const pascalCase = iconName
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');
      
      return (LucideIcons as any)[pascalCase];
    }
    
    // If already PascalCase
    return (LucideIcons as any)[iconName];
  };

  return (
    <FormField
      control={control}
      name="icone"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Ícone</FormLabel>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-start text-left font-normal"
              >
                <div className="flex items-center gap-2">
                  {field.value && getIconComponent(field.value) ? (
                    <>
                      {React.createElement(getIconComponent(field.value) as React.ElementType, { 
                        className: "mr-2",
                        size: 16 
                      })}
                      <span>{field.value}</span>
                    </>
                  ) : (
                    "Selecionar um ícone"
                  )}
                </div>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>Selecione um ícone</DialogTitle>
                <DialogDescription>
                  Escolha um ícone da biblioteca Lucide para usar na sua tela
                </DialogDescription>
              </DialogHeader>
              <div className="relative mb-4">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar ícones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <ScrollArea className="h-[500px] pr-4">
                <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 md:grid-cols-8">
                  <Button
                    key="none"
                    variant={!field.value ? "secondary" : "outline"}
                    className="flex h-24 w-full flex-col items-center justify-center gap-2 p-2"
                    onClick={() => {
                      field.onChange(null);
                      setIsOpen(false);
                    }}
                  >
                    <div className="h-8 w-8 rounded-md border-2 border-dashed border-muted-foreground/25" />
                    <span className="text-xs">Nenhum</span>
                  </Button>
                  {filteredIcons.map(({ name, displayName, component: IconComp }) => (
                    <Button
                      key={name}
                      variant={field.value === name ? "secondary" : "outline"}
                      className="flex h-24 w-full flex-col items-center justify-center gap-2 p-2"
                      onClick={() => {
                        field.onChange(name);
                        setIsOpen(false);
                      }}
                    >
                      {React.createElement(IconComp as React.ElementType, { size: 32 })}
                      <span className="text-xs text-center break-all">{name}</span>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
