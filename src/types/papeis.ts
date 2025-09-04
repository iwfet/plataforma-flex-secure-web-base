
import { TelaPermitida } from './index';

export interface PapelDTO {
    id: number;
    nomePapel: string;
    descricao: string;
    permissoes?: TelaPermitidaDTO[];
}

export interface TelaPermitidaDTO extends TelaPermitida {
    permitido?: boolean;
}

export interface NovoPapelDTO {
    nomePapel: string;
    descricao: string;
}

export interface AtualizaPapelDTO {
    nomePapel?: string;
    descricao?: string;
}
