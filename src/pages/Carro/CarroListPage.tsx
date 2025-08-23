import { useState, useEffect } from 'react';
import { getCarros, getMarcas, deleteCarro } from '../../services/api';
import type { Carro, Marca } from '../../services/api';
import CrudListPage from '../../components/crud/CrudListPage';

function CarroListPage() {
  // O estado e busca de dados continuam na página específica, o que é uma boa prática.
  const [marcas, setMarcas] = useState<Marca[]>([]);

  useEffect(() => {
    const fetchMarcas = async () => {
      try {
        const response = await getMarcas();
        setMarcas(response.data);
      } catch (err) {
        console.error('Falha ao carregar as marcas.', err);
      }
    };
    fetchMarcas();
  }, []);

  const api = {
    getAll: getCarros, // O componente genérico agora pode buscar os carros diretamente
    delete: deleteCarro,
  };

  // Criando o mapa de marcas para usar na função getGroupName
  const marcaMap = marcas.reduce((acc, marca) => {
    acc[marca.id] = marca.nome_marca;
    return acc;
  }, {} as { [key: number]: string });

  // Função para buscar o nome da marca pelo ID
  const getGroupName = (brandId: number) => marcaMap[brandId] || 'Marca Desconhecida';
  
  // Função para formatar o valor como moeda
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

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
      dataAccessor="cars" // Acessa a propriedade 'cars' da resposta da API
      groupBy="brand"     // ATIVA O AGRUPAMENTO pelo campo 'brand'
      getGroupName={getGroupName} // Fornece a função para obter o nome do grupo
      renderCell={(item, column) => {
        if (column.accessor === 'valor') {
          return formatCurrency(Number(item.valor));
        }
        return String(item[column.accessor as keyof Carro]);
      }}
    />
  );
}

export default CarroListPage;