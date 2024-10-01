
# Backend - Gestão de Contas a Pagar

## Descrição

Este é o backend de uma aplicação de gestão de contas a pagar. A API foi desenvolvida em Node.js com TypeScript e utiliza MySQL como banco de dados. A aplicação permite a autenticação de usuários, cadastro de fornecedores, lançamentos de contas a pagar, atualização de status e mantém logs de todas as ações.

### Funcionalidades:
- **Autenticação de Usuários**: Registro e login com JWT.
- **Gerenciamento de Contas a Pagar**: Criação, listagem e atualização de pagamentos.
- **Gerenciamento de Fornecedores**: Cadastro e listagem de fornecedores.
- **Logs de Ações**: Agora os logs são gravados diretamente no banco de dados MySQL, em vez de arquivos, para auditoria e monitoramento de ações importantes no sistema.

## Requisitos

- **Node.js**: Versão 14+.
- **MySQL**: Banco de dados para armazenar as informações da aplicação.

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/gestao-contas.git
cd gestao-contas/backend
```

2. Instale as dependências do projeto:

```bash
npm install
```

3. Configure o arquivo `.env`:

Crie um arquivo `.env` na raiz do backend e adicione as seguintes variáveis:

```bash
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=gestao_contas
JWT_SECRET=sua_chave_secreta
PORT=3000
```

4. Configure o MySQL:

Crie um banco de dados no MySQL:

```sql
CREATE DATABASE gestao_contas;
```

### Estrutura de Tabelas:

Crie as tabelas necessárias no MySQL utilizando os seguintes comandos:

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE suppliers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  cnpj VARCHAR(18) NOT NULL UNIQUE,
  address VARCHAR(255) NOT NULL
);

CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  supplier_id INT,
  payment_type ENUM('Boleto', 'Dinheiro', 'Cartão de Crédito', 'Transferência'),
  amount DECIMAL(10, 2) NOT NULL,
  due_date DATE NOT NULL,
  store ENUM('Supermercado', 'Distribuidora Atacado', 'Empório'),
  status ENUM('Aberto', 'Pago'),
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE
);

CREATE TABLE logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE payments
ADD COLUMN description TEXT AFTER status,
ADD COLUMN boleto_code VARCHAR(255) AFTER description;

ALTER TABLE payments
ADD COLUMN payment_date TIMESTAMP NULL DEFAULT NULL AFTER boleto_code;

```

5. Execute o servidor:

```bash
npm run dev
```

## Rotas da API

### Autenticação

- **POST** `/auth/register`: Registrar um novo usuário.
  - Body:
    ```json
    {
      "username": "seu_usuario",
      "password": "sua_senha"
    }
    ```

- **POST** `/auth/login`: Login de um usuário e obtenção do token JWT.
  - Body:
    ```json
    {
      "username": "seu_usuario",
      "password": "sua_senha"
    }
    ```

### Fornecedores

- **POST** `/suppliers`: Cadastro de fornecedor (requer token JWT).
  - Body:
    ```json
    {
      "name": "Nome do Fornecedor",
      "cnpj": "00.000.000/0001-00",
      "address": "Endereço do Fornecedor"
    }
    ```

- **GET** `/suppliers`: Listar todos os fornecedores cadastrados (requer token JWT).

### Contas a Pagar

- **POST** `/payments`: Criar um lançamento de conta a pagar (requer token JWT).
  - Body:
    ```json
    {
      "supplierId": 1,
      "paymentType": "Boleto",
      "amount": 150.00,
      "dueDate": "2024-09-30",
      "store": "Supermercado",
      "status": "Aberto"
    }
    ```

- **GET** `/payments`: Listar todos os lançamentos de contas a pagar (requer token JWT).

- **PUT** `/payments/:id`: Atualizar o status de um pagamento (requer token JWT).
  - Body:
    ```json
    {
      "status": "Pago"
    }
    ```

### Logs

Os logs de ações (como criação de usuários, atualizações de pagamentos, etc.) são registrados diretamente no banco de dados MySQL na tabela `logs`, em vez de serem gravados em arquivos. Isso facilita a auditoria e o monitoramento das atividades do sistema.

## Estrutura de Pastas

A estrutura de pastas do projeto segue uma organização modular para facilitar a manutenção e expansão:

```bash
backend
├── config        # Configurações do banco de dados
├── logs          # Logs de ações do sistema (agora desativado, pois os logs vão para o banco de dados)
├── src
│   ├── controllers   # Controladores das rotas
│   ├── middlewares   # Middlewares (como autenticação)
│   ├── models        # Modelos de dados (interações com o banco de dados)
│   ├── routes        # Definição das rotas da API
│   ├── services      # Lógica de negócios da aplicação
│   ├── utils         # Funções auxiliares (como o logger)
│   └── index.ts      # Ponto de entrada do servidor
└── .env           # Variáveis de ambiente
```

## Tecnologias Utilizadas

- **Node.js** com **Express**: Framework para a criação da API.
- **TypeScript**: Para tipagem estática e melhor manutenção do código.
- **MySQL**: Banco de dados relacional para armazenamento das informações.
- **JWT**: Para autenticação e autorização dos usuários.
- **bcryptjs**: Para hash de senhas.
- **dotenv**: Gerenciamento de variáveis de ambiente.

## Executando o Projeto

1. Clone o repositório e siga as instruções de instalação.
2. Configure o `.env` corretamente.
3. Crie as tabelas no banco de dados MySQL.
4. Execute o comando `npm run dev` para iniciar o servidor.
5. Acesse as rotas da API conforme descrito na seção **Rotas da API**.
