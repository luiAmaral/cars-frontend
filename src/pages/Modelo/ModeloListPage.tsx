import { useState, useEffect } from 'react';
import CrudListPage from '../../components/crud/CrudListPage';
import { getModelos, getMarcas, deleteModelo } from '../../services/api';
import type { Modelo, Marca } from '../../services/api';

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

function ModeloListPage() {
  const [marcas, setMarcas] = useState<Marca[]>([]);

  const fetchMarcas = async () => {
    try {
      const marcasResponse = await getMarcas();
      setMarcas(marcasResponse.data);
    } catch (err) {
      console.error('Falha ao carregar as marcas', err);
    }
  };

  useEffect(() => {
    fetchMarcas();
  }, []);

  const marcaMap = marcas.reduce((acc, marca) => {
    acc[marca.id] = marca.nome_marca;
    return acc;
  }, {} as { [key: number]: string });

  const modeloApi = {
    getAll: getModelos,
    delete: deleteModelo,
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Nome do Modelo', accessor: 'nome' },
    { header: 'Marca', accessor: 'marca_id' },
    { header: 'Valor', accessor: 'valor_fipe' }, 
  ];

  const replaceMarcaIdWithName = (marcaId: number): string => {
    return marcaMap[marcaId] || 'Marca Desconhecida';
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
          return replaceMarcaIdWithName(row[column.accessor as keyof Modelo] as number);
        }
        if (column.accessor === 'valor_fipe') {
          return formatCurrency(Number(row[column.accessor as keyof Modelo]));
        }
        return row[column.accessor as keyof Modelo];
      }}
    />
  );
}

export default ModeloListPage;
