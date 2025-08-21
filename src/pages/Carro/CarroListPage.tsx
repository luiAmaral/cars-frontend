import { useState, useEffect } from 'react';
import { getCarros, getMarcas, getModelos, deleteCarro } from '../../services/api';
import type { Carro, Marca, Modelo } from '../../services/api';
import GroupedListPage from '../../components/crud/CrudGroupedPage';

interface DadosDaPagina {
  carros: Carro[];
  marcas: Marca[];
  modelos: Modelo[];
}

function CarroListPage() {
  const [dados, setDados] = useState<DadosDaPagina | null>(null);

  const fetchData = async () => {
    try {
      const [carrosResponse, marcasResponse, modelosResponse] = await Promise.all([
        getCarros(),
        getMarcas(),
        getModelos(),
      ]);
      
      setDados({
        carros: carrosResponse.data.cars,
        marcas: marcasResponse.data,
        modelos: modelosResponse.data,
      });
    } catch (err) {
      console.error('Falha ao carregar os dados.', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const api = {
    getAll: async () => {
      return { data: dados?.carros || [] }; // Passando a lista de carros diretamente para o GroupedListPage
    },
    delete: deleteCarro,
  };

  // Criando o mapa de marcas onde a chave é o id da marca e o valor é o nome da marca
  const marcaMap = dados?.marcas.reduce((acc, marca) => {
    acc[marca.id] = marca.nome_marca;  // Supondo que 'nome_marca' seja o nome da marca
    return acc;
  }, {} as { [key: number]: string });

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Modelo', accessor: 'nome_modelo' },
    { header: 'Ano', accessor: 'ano' },
    { header: 'Valor', accessor: 'valor' },
  ];

  return (
    <GroupedListPage
      title="Gerenciar Carros"
      api={api}
      columns={columns}
      addPath="/carros/novo"
      editPath="/carros/editar"
      groupBy="brand"  // Agrupando por marca
      marcaMap={marcaMap || {}}  // Garantindo que marcaMap nunca seja undefined
    />
  );
}

export default CarroListPage;
