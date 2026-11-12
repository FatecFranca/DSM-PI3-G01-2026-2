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
- Link util para a configuração do Amazon S3: https://www.youtube.com/watch?v=eQAIojcArRY&t=2040s
- MongoDB: local ou MongoDB Atlas
- Java: local ou usar o GitHub Codespaces

# Como testar o Sistema:
#### **1ª Etapa:** Clone o repositório e entre na pasta.
```bash
git clone https://github.com/FatecFranca/DSM-PI3-G01-2026-2.git

cd DSM-PI3-G01-2026-2
```

## Back-End


#### **2ª Etapa:** Entre na pasta da api do projeto
```bash
cd backend/api
```
#### **3ª Etapa:** Edite o application.properties com suas configurações

Crie a cópia do arquivo de exemplo
```bash
cp src/main/resources/application.properties.example src/main/resources/application.properties
```

E adicione as suas credenciais do amazon e o seu banco de dados
```bash
spring.application.name=api

# Configura a porta da aplicação
server.port=8888

spring.mongodb.uri=

# Conexão do AmazonS3
aws.bucket-name=
aws.region=

aws.access-key= 
aws.secret-key= 

# Limite de tamanho dos arquivos enviados
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```
### Como preencher cada campo:
- `spring.mongodb.uri=`: É a rota de conecção do MongoDB
- `aws.bucket-name=`: É o nome do bucket da AWS
- `aws.region=`: A região que o bucket pertence
- `aws.access-key=`: Aqui fica a chave de acesso do usuário IAM da AWS
- `aws.secret-key=`: Aqui fica a chave secreda do usuário IAM da AWS

#### **4ª Etapa:** Inicie o servidor do Back-End
```bash
./mvnw spring-boot:run
```

## Front-End

#### **5ª Etapa:** Entre na pasta do Front-End do projeto
```bash
cd frontend
```
#### **6ª Etapa:** Instale as dependências
```bash
npm install
```

#### **7ª Etapa:** Inicie o servidor do Front-End
```bash
npm run dev
```

## Rotas:

**Cliente:** Acessa o cardápio, visualiza os produtos e realiza pedidos.

**Administração:** Gerencia o cardápio, cadastra e edita produtos e manipula os pedidos realizados.
- Cliente: http://localhost:5173/
- Administração: http://localhost:5173/menu

**Por segurança** A rota do cliente não permite acesso às funcionalidades da rota de administração.

## O que fazer para testar
Para começar a utilizar o GiMeal, é necessário acessar a rota de administração e cadastrar pelo menos um produto no cardápio.

Após o cadastro, o produto ficará disponível na rota do cliente, permitindo visualizar o cardápio e testar as funcionalidades de realização de pedidos.

**Observação:** Algumas informações são geradas automaticamente pelo sistema durante o cadastro. Por isso, não é necessário preencher manualmente dados internos do banco de dados.

## Arquitetura do Projeto

O GiMeal utiliza uma **arquitetura em camadas no Back-End**, separando as responsabilidades da aplicação para facilitar a organização e a manutenção do código.

### Back-End
- **Controllers:** recebem as requisições HTTP e encaminham as operações para os serviços.
- **Services:** concentram as regras de negócio e a lógica da aplicação, incluindo operações relacionadas aos produtos, pedidos e imagens.
- **Repositories:** realizam o acesso e as operações no banco de dados MongoDB, utilizando Spring Data.
- **Models:** representam os dados e as estruturas utilizadas pela aplicação.
- **DTOs (Data Transfer Objects):** definem os dados recebidos e enviados pela API.
- **Config:** reúne as configurações da aplicação, incluindo CORS e integração com Amazon S3.
- **Exceptions:** centralizam o tratamento de erros e a padronização das respostas de erro da API.

### Front-End
O Front-End utiliza React e possui seus próprios serviços para comunicação com a API, além de componentes reutilizáveis, páginas e arquivos de estilização.

## Endpoints da API

### Categorias
```bash
GET     /categorias         # Lista todas as categorias.
GET     /categorias/{id}    # Busca uma categoria pelo ID.
POST    /categorias         # Cadastra uma categoria.
PUT     /categorias/{id}    # Atualiza uma categoria.
DELETE  /categorias/{id}    # Exclui uma categoria.
```

### Ingredientes 
```bash
GET     /ingredientes       # Lista todos os ingredientes.
GET     /ingredientes/{id}  # Busca um ingrediente pelo ID.
POST    /ingredientes       # Cadastra um ingrediente.
PUT     /ingredientes/{id}  # Atualiza um ingrediente.
DELETE  /ingredientes/{id}  # Exclui um ingrediente.
```

### Pedidos
```bash
GET     /pedidos                    # Lista os pedidos, com opção de filtrar por status.
GET     /pedidos/hoje               # Lista os pedidos do dia atual.
GET     /pedidos/{id}               # Busca um pedido pelo ID.
POST    /pedidos                    # Registra um novo pedido.
PATCH   /pedidos/{id}/status        # Atualiza o status de um pedido.
PATCH   /pedidos/{id}/tempo-preparo # Atualiza o tempo de preparo do pedido.
POST    /pedidos/{id}/avaliacao     # Registra a avaliação de um pedido.
DELETE  /pedidos/{id}               # Exclui um pedido.
```

### Produtos
```bash
GET     /produtos                           # Lista todos os produtos.
GET     /produtos/{id}                      # Busca um produto pelo ID.
GET     /produtos/categoria/{categoriaId}   # Lista os produtos de uma categoria específica.
POST    /produtos                           # Cadastra um produto.
PUT     /produtos/{id}                      # Atualiza os dados de um produto.
PUT     /produtos/{id}/imagem               # Envia ou atualiza a imagem de um produto.
DELETE  /produtos/{id}/imagem               # Exclui a imagem de um produto.
DELETE  /produtos/{id}                      # Exclui um produto.
```

## Troubleshooting (Problemas comuns)

### 1. Erro na configuração do JAVA_HOME

**Problema:** Ao tentar executar o backend, o terminal informa que o Java não foi encontrado ou que a variável `JAVA_HOME` não está configurada.

**Solução:** Verifique se o JDK está instalado e se a variável de ambiente `JAVA_HOME` aponta para o diretório de instalação do Java. Após configurar, reinicie o terminal.

Para verificar a versão do Java digite esse comando no cmd
```cmd
javac --version
```
Se não tiver retorno, é porque o Java não está instalado na máquina.

Para definir o JAVA_HOME após baixar o JDK execute o comando como administrador e coloque o caminho da pasta que seu Java foi baixado
```cmd
setx -m JAVA_HOME "C:\Program Files\Java\jdk-21
```

### 2. Erro ao iniciar o backend por falta de configuração

**Problema:** A aplicação apresenta erros ao iniciar devido à ausência das configurações necessárias no `application.properties`.

**Solução:** Verifique se o arquivo `application.properties` foi criado a partir do `application.properties.example` e se as informações de conexão com o MongoDB e as credenciais do Amazon S3 foram preenchidas corretamente.

### 3. Erro ao executar o Front-End

**Problema:** Ao executar `npm install` ou `npm run dev`, o terminal informa que o comando `npm` não foi encontrado ou não é reconhecido.

**Solução:** Verifique se o Node.js está instalado e se foi adicionado às variáveis de ambiente do sistema. O npm é instalado junto com o Node.js. Após a instalação, reinicie o terminal.

Para verificar a versão do Node instalada digite esse comando no cmd
```cmd
node --version
```
Se não tiver retorno, é porque o node não está instalado na máquina.

## Sugestões de melhorias futuras

- Adicionar uma validação a mais para a rota da Administração para melhorar a segurança (login de adm).
- Implementar a Aba de Aparencia.
- Melhorar a geração de URL temporária da imagem tornando ela automática para evitar do link expirar.
- Adicionar a possibilidade de atualizar a categoria pelo Front ao invés de só criar e remover.
- Adicionar um filtro de sugestão melhor para ingredientes evitando duplicidade de dados

## Equipe 
**GRUPO 01 - DSM 3º Semestre 2026/2**

- Andre Joaquim Santana da Silva  
- Gabriel Povidaiko Suto de Morais  
- Maria Eduarda Moraes Vieira 
- Rafael Silva Machado

**Instituição:** FATEC Franca  
**Curso:** Desenvolvimento de Software Multiplataforma  
**Semestre:** 3º - 2026/2  