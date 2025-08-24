import { useState, useEffect } from 'react';
import { getCarros, getMarcas, deleteCarro } from '../../services/api';
import type { Carro, Marca } from '../../services/api';
import CrudListPage from '../../components/crud/CrudListPage';

function CarroListPage() {
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
    getAll: getCarros,
    delete: deleteCarro,
  };

  const marcaMap = marcas.reduce((acc, marca) => {
    acc[marca.id] = marca.nome_marca;
    return acc;
  }, {} as { [key: number]: string });

  const getGroupName = (brandId: number) => marcaMap[brandId] || 'Marca Desconhecida';
  
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
      dataAccessor="cars" 
      groupBy="brand"
      getGroupName={getGroupName}
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