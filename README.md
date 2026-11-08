# DSM-PI3-G01-2026-2 - GiMeal
### Aplicado em uma cafeteria

**Repositório do GRUPO 01 do Projeto Interdisciplinar do 3º semestre DSM 2026/2.**

**Alunos:** Andre Joaquim Santana da Silva, Gabriel Povidaiko Suto de Morais, Maria Eduarda Moraes Vieira, Rafael Silva Machado

# Sobre o Projeto

&emsp;O GiMeal é um software de totem para restaurantes, feito para ser usado em dispositivos fixos na mesa (como tablets), feito para facilitar o atendimento ao cliente e proporcionar uma boa experiencia para eles na hora de realizar o pedido, alem de auxiliar no gerenciamento do estabelecimento.

## Principais funcionalidades

- Gerenciamento do cardápio (por parte da gestão do estabelecimento)
- Auto atendimento do cliente (ele mesmo faz o pedido)
- Personalização dos pratos / bebidas
- Acompanhamento dos pedidos (tanto para a cozinha quanto para o cliente)

## Tecnologias

### Back-End

- Java + Spring Boot - API REST
- MongoDB - Banco de dados NoSql
- Amazon S3 - Bucket da amazon para imagem
- IAM - Usuario para realizar o CRUD no bucket da amazon

### Front-End

- React.js - Biblioteca UI
- JavaScript - Funcionalidades e interações do sistema
- Vite - Execução e compilação
- CSS3 - Estilização das páginas

## Bibliotecas utilizadas

- React Router DOM: Gerenciamento da navegação entre páginas.
- Styled Components: Criação e organização de estilos utilizando JavaScript.
- Framer Motion: Criação de animações e transições nas interfaces.
- Lucide React e React Icons: Bibliotecas de ícones.
- Bootstrap Icons: Conjunto adicional de ícones.
- Swiper: Criação de carrosséis e elementos deslizantes.


## Estrutura do Projeto

```text
DSM-PI3-G01-2026-2/
├── .devcontainer/      # Configurações do Amb de desenvolvimento
├── .vscode/                    # Configurações do Visual Studio Code
│
├── backend/                    # Backend da aplicação
│   └── api/
│       ├── .mvn/                # Configurações do Maven Wrapper
│       └── src/
│           ├── main/
│           │   ├── java/com/gimeal/api/
│           │   │   ├── config/       # Configurações da aplicação
│           │   │   ├── controller/   # Controladores das requisições HTTP
│           │   │   ├── model/
│           │   │   │   ├── dto/      # Objetos de transferência de dados
│           │   │   │   └── entity/   # Entidades do banco de dados
│           │   │   ├── repository/   # Acesso e operações no MongoDB
│           │   │   └── service/      # Regras e lógica de negócio
│           │   │
│           │   └── resources/        # Arquivos de configuração e recursos
│           │
│           └── test/                # Testes da aplicação
│
├── frontend/                    # Frontend da aplicação
│   ├── public/                  # Arquivos públicos
│   └── src/
│       ├── assets/              # Imagens e recursos visuais
│       ├── componets/           # Componentes reutilizáveis
│       │   ├── Button/
│       │   ├── Header/
│       │   ├── IconesCategorias/
│       │   ├── IconesPagamento/
│       │   ├── Input/
│       │   ├── ListaCategorias/
│       │   ├── MenuAba/
│       │   └── Slider/
│       │
│       ├── context/             # Gerenciamento de estados globais
│       ├── pages/               # Páginas da aplicação
│       │   ├── adm/             # Telas administrativas
│       │   ├── cliente/         # Telas do cliente
│       │   └── cozinha/         # Telas da cozinha
│       │
│       └── styles/              # Arquivos de estilização CSS
│
├── docs/                        # Documentação do projeto
│   ├── db/                      # Documentação do banco de dados
│   ├── Doc UI-UX/               # Documentação de UI/UX
│   └── Termo de Abertura - TAP/ # Termo de Abertura do Projeto
│
└── README.md                  # Documentação principal do projeto
```

## Intalação e configuração

### Pré-requisitos

- Amazon S3: criar um bucket com uma sub pasta `images/`
- Usuário IAM: com permissões de `GET` | `PUT` | `DELETE`
- MongoDB: local ou MongoDB Atlas

### Back-End