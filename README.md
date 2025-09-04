# Plataforma Flex Secure Web Base

![Plataforma Flex Secure Web Base Logo](https://via.placeholder.com/120x120.png?text=PFSWB)

Uma base de aplicação web robusta, segura e flexível, projetada para acelerar o desenvolvimento de sistemas que exigem autenticação avançada, controle de acesso granular e uma estrutura administrativa completa.

## 🚀 Tecnologias Utilizadas

Este projeto foi construído com tecnologias modernas e populares no ecossistema JavaScript:

-   **Frontend**: [React](https://reactjs.org/) (com SWC)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
-   **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
-   **Componentes de UI**: [Shadcn/ui](https://ui.shadcn.com/) e [Radix UI](https://www.radix-ui.com/)
-   **Roteamento**: [React Router DOM](https://reactrouter.com/)
-   **Gerenciamento de Estado de Servidor**: [TanStack Query](https://tanstack.com/query)
-   **Validação de Formulários**: [React Hook Form](https://react-hook-form.com/) e [Zod](https://zod.dev/)

## ✨ Recursos Principais

-   **Autenticação Completa**: Gerencia todo o fluxo de login, logout, recuperação e redefinição de senha com segurança.
-   **Sistema de Tokens JWT**: Utiliza tokens de acesso e de atualização (refresh tokens) para manter a sessão segura e atualizada, com um interceptor que gerencia a expiração e a renovação automática.
-   **Controle de Acesso Baseado em Papéis (RBAC)**: Define permissões de acesso a telas e funcionalidades por meio de perfis de usuário (`papeis`), garantindo flexibilidade e segurança.
-   **Gerenciamento Dinâmico**: Permite o gerenciamento de usuários, criação e edição de papéis com permissões granulares, e a organização da hierarquia de telas do sistema.
-   **Arquitetura Modular**: Desenvolvido com uma estrutura de componentes reutilizáveis, custom hooks para lógica de negócio e uma separação de responsabilidades clara para facilitar a manutenção e escalabilidade.
-   **Gerenciamento de Sessões de Dispositivo**: Permite visualizar e revogar sessões ativas de diferentes dispositivos, aumentando a segurança do usuário.

## 🤝 Parceria com o Backend

Este projeto foi projetado para funcionar em conjunto com um backend robusto e escalável. Ele já está configurado para se integrar perfeitamente com a API construída com [NestJS](https://nestjs.com/).

**Repositório do Backend**: [backend-base-nest-api](https://github.com/iwfet/backend-base-nest-api)

Agradecemos ao criador do projeto de backend pela excelente arquitetura que complementa esta base web.

## 📦 Instalação e Uso

Para começar, clone o repositório e siga os passos abaixo:

```bash
# 1. Clone o repositório
git clone [https://github.com/seu-usuario/plataforma-flex-secure-web-base.git](https://github.com/seu-usuario/plataforma-flex-secure-web-base.git)

# 2. Navegue até a pasta do projeto
cd plataforma-flex-secure-web-base

# 3. Instale as dependências com pnpm (recomendado)
pnpm install

# 4. Inicie o servidor de desenvolvimento
pnpm run dev