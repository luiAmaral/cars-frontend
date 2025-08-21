import { useState, useEffect } from 'react';
import CrudListPage from '../../components/crud/CrudListPage';
import { getModelos, getMarcas, deleteModelo } from '../../services/api';
import type { Modelo, Marca } from '../../services/api';

function ModeloListPage() {
  const [marcas, setMarcas] = useState<Marca[]>([]);

  // Função para carregar as marcas e criar o mapa
  const fetchMarcas = async () => {
    try {
      const marcasResponse = await getMarcas();
      setMarcas(marcasResponse.data);
    } catch (err) {
      console.error('Falha ao carregar as marcas', err);
    }
  };

  // Carregar as marcas ao iniciar o componente
  useEffect(() => {
    fetchMarcas();
  }, []);

  // Criar um mapa de marcas onde a chave é o id da marca e o valor é o nome da marca
  const marcaMap = marcas.reduce((acc, marca) => {
    acc[marca.id] = marca.nome_marca;  // Substitua 'nome_marca' pelo campo correto que tem o nome da marca
    return acc;
  }, {} as { [key: number]: string });

  const modeloApi = {
    getAll: getModelos,
    delete: deleteModelo,
  };

  // Definimos as colunas que queremos exibir na tabela de modelos
  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Nome do Modelo', accessor: 'nome' },
    { header: 'Marca', accessor: 'marca_id' }, // Mostra o nome da marca em vez do ID
  ];

  // Função para substituir o ID da marca pelo nome
  const replaceMarcaIdWithName = (marcaId: number): string => {
    return marcaMap[marcaId] || 'Marca Desconhecida'; // Se não encontrar a marca, exibe 'Marca Desconhecida'
  };

  return (
    <CrudListPage<Modelo>
      title="Gerenciar Modelos"
      api={modeloApi}
      columns={columns}
      addPath="/modelos/novo"
      editPath="/modelos/editar"
      renderCell={(row, column) => {
        if (column.accessor === 'marca_id') {
          // Substitui o ID da marca pelo nome
          return replaceMarcaIdWithName(row[column.accessor as keyof Modelo] as number);
        }
        return row[column.accessor as keyof Modelo];
      }}
    />
  );
}

export default ModeloListPage;
