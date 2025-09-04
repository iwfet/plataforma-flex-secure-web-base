export interface UserDTO {
    id: number;
    nomeUsuario: string;
    email: string;
    ativo: boolean;
    admin: boolean;
    fotoPerfil: string | null;
    papelId: number;
    papelNome: string;
}

export interface CreateUserDTO {
    nomeUsuario: string;
    email: string;
    senha: string;
    ativo?: boolean;
    admin?: boolean;
    papelId: number;
}

export interface UpdateUserDTO {
    nomeUsuario?: string;
    email?: string;
    papelId?: number;
    ativo?: boolean;
}

export interface ChangePasswordDTO {
    senha: string;
}

export interface PapelDTO {
    id: number;
    nomePapel: string;
    descricao: string;
}
