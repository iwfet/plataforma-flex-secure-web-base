
import React from 'react';
import { Input } from '@/components/ui/input';

interface SearchAtribuicoesProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const SearchAtribuicoes: React.FC<SearchAtribuicoesProps> = ({
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <div className="mb-4">
      <Input
        placeholder="Buscar por usuário ou papel..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-md"
      />
    </div>
  );
};

export default SearchAtribuicoes;
