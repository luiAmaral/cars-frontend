Bem-vindo ao repositório do front-end do projeto WS Work, uma aplicação desenvolvida para gerenciar o cadastro de carros, marcas e modelos. A interface é limpa e moderna e, foi construída com as tecnologias mais recentes do ecossistema React.

## ✨ Funcionalidades

O projeto implementa as operações básicas de um CRUD (Create, Read, Update, Delete) para as seguintes entidades:

* **Carros**: Cadastro e gerenciamento de veículos.
* **Marcas**: Gerenciamento das marcas de carros disponíveis.
* **Modelos**: Gerenciamento dos modelos associados a cada marca.

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando as seguintes tecnologias:

* **[React](https://reactjs.org/)**: Biblioteca para construção de interfaces de usuário.
* **[TypeScript](https://www.typescriptlang.org/)**: Superset do JavaScript que adiciona tipagem estática.
* **[Vite](https://vitejs.dev/)**: Ferramenta de build moderna e extremamente rápida para o desenvolvimento frontend.
* **CSS Modules**: Para estilização local e componentizada.

## 🚀 Como Executar o Projeto

Siga os passos abaixo para rodar a aplicação em seu ambiente de desenvolvimento.

### Pré-requisitos

* [Node.js](https://nodejs.org/en/) (versão LTS recomendada)
* [Yarn](https://classic.yarnpkg.com/) ou [NPM](https://www.npmjs.com/)

### Instalação

1.  Clone este repositório:
    git clone https://github.com/luiAmaral/cars-frontend.git

2.  Navegue até o diretório do projeto:
    cd cars-frontend

3.  Instale as dependências:

    npm install
    OU
    yarn install

### Executando a Aplicação

Para iniciar o servidor de desenvolvimento, execute o comando:

npm run dev
OU
yarn dev


A aplicação estará disponível em `http://localhost:5173` (ou em outra porta indicada no terminal).

## 🧱 Componente Reutilizável: `CrudListPage`

- Gerencia automaticamente os estados de loading, error e a busca de dados da API.
- Funciona com qualquer tipo de dado, sendo totalmente configurado via props.
- Suporta agrupamento de dados (ex: agrupar carros por marca) e renderização customizada de células (ex: formatar valores como moeda), tornando-o extremamente flexível.
- Garante que todas as páginas de listagem do projeto tenham a mesma estrutura, botões e comportamento.

### Como Usar

### Uso Básico (Tabela Simples)

Para renderizar uma tabela de listagem padrão, sem customizações avançadas, você precisa fornecer as `props` obrigatórias. Este exemplo cria a página de listagem de Marcas.

`import CrudListPage from '../../components/crud/CrudListPage';
import { getMarcas, deleteMarca } from '../../services/api';
import type { Marca } from '../../services/api';

function MarcaListPage() {
  const marcaApi = {
    getAll: getMarcas,
    delete: deleteMarca,
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Nome da Marca', accessor: 'nome_marca' },
  ];

  return (
    <CrudListPage<Marca>
      title="Gerenciar Marcas"
      api={marcaApi}
      columns={columns}
      addPath="/marcas/novo"
      editPath="/marcas/editar"
    />
  );
}`

### Uso Completo (Com Agrupamento e Renderização Customizada)

Para cenários mais complexos, você pode utilizar as `props` opcionais para agrupar dados e formatar o conteúdo das células. Este exemplo mostra a configuração da página de Carros, que são agrupados por marca e têm a coluna de valor formatada como moeda.

`import CrudListPage from '../../components/crud/CrudListPage';
import { getCarros, getMarcas, deleteCarro } from '../../services/api';

function CarroListPage() {
  // ... lógica para buscar marcas e criar o 'marcaMap'

  // Função para traduzir o ID da marca para seu nome
  const getGroupName = (brandId: number) => marcaMap[brandId] || 'Marca Desconhecida';

  // Função para formatar um número como moeda BRL
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const api = { getAll: getCarros, delete: deleteCarro };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Modelo', accessor: 'nome_modelo' },
    { header: 'Ano', accessor: 'ano' },
    { header: 'Valor', accessor: 'valor' },
  ];

  return (
    <CrudListPage<Carro>
      title="Gerenciar Carros"
      api={api}
      columns={columns}
      addPath="/carros/novo"
      editPath="/carros/editar"
      // 1. Informa que o array de dados está na chave 'cars' da resposta da API
      dataAccessor="cars"
      // 2. Ativa o agrupamento, usando a chave 'brand' de cada objeto Carro
      groupBy="brand"
      
      // 3. Fornece a função que transforma o ID do grupo em um nome de exibição
      getGroupName={getGroupName}
      
      // 4. Customiza a renderização de células específicas
      renderCell={(item, column) => {
        if (column.accessor === 'valor') {
          return formatCurrency(Number(item.valor));
        }
        // Para as outras colunas, retorna o valor padrão
        return String(item[column.accessor as keyof Carro]);
      }}
    />
  );
}`
