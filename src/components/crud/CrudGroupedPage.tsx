/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../../components/common/Spinner';

interface Column {
  header: string;
  accessor: string;
}

interface ApiFunctions<T> {
  getAll: () => Promise<{ data: T[] | { [key: string]: T[] } }>;
  delete: (id: number | string) => Promise<void>;
}

interface GroupedListPageProps<T> {
  title: string;
  api: ApiFunctions<T>;
  columns: Column[];
  addPath: string;
  editPath: string;
  dataAccessor?: string;
  groupBy: keyof T;
}

function GroupedListPage<T extends { id: number | string }>({
  title,
  api,
  columns,
  addPath,
  editPath,
  dataAccessor,
  groupBy,
  marcaMap,
}: GroupedListPageProps<T> & { marcaMap: { [key: number]: string } }) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.getAll();
      
      const data = dataAccessor && dataAccessor in response.data
        ? (response.data as { [key: string]: T[] })[dataAccessor]
        : response.data;

      if (Array.isArray(data)) {
        setItems(data);
      } else {
        console.error("Erro: Os dados recebidos da API não são válidos.", response.data);
        throw new Error("Formato de dados inválido recebido da API.");
      }
    } catch (err) {
      setError(`Falha ao carregar ${title.toLowerCase()}.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [api, dataAccessor]);

  const handleDelete = async (id: number | string) => {
    if (window.confirm('Tem certeza que deseja excluir este item?')) {
      try {
        await api.delete(id);
        alert('Item excluído com sucesso!');
        // Atualizando diretamente o estado após exclusão
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
      } catch (err: any) {
        alert(`Erro ao excluir o item: ${err.response?.data?.detail || err.message}`);
        console.error(err);
      }
    }
  };

  if (loading) return <Spinner />;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  // Agrupando os itens com base no campo "groupBy" (agrupar por marca)
  const groupedItems = items.reduce((acc, item) => {
    const groupKey = item[groupBy as keyof T] as string;

    // Substituindo o id da marca pelo nome da marca (usando o mapa de marcas)
    const brandName = marcaMap[groupKey as unknown as number] || 'Marca Desconhecida';
    
    if (!acc[brandName]) {
      acc[brandName] = [];
    }
    acc[brandName].push(item);
    return acc;
  }, {} as { [key: string]: T[] });

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="crud-list-page">
      <div className="header">
        <h1>{title}</h1>
        <Link to={addPath} className="add-button">Adicionar Novo</Link>
      </div>

      {Object.keys(groupedItems).map(group => (
        <div key={group} style={{ marginBottom: '2rem' }}>
          <h2>{group}</h2> {/* Aqui o nome da marca será exibido */}
          <table className="crud-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.accessor}>{col.header}</th>
                ))}
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {groupedItems[group].map((item) => (
                <tr key={item.id}>
                  {columns.map((col) => (
                    <td key={col.accessor}>
                      {col.accessor === 'valor' ? formatCurrency(Number(item[col.accessor as keyof T])) : String(item[col.accessor as keyof T])}
                    </td>
                  ))}
                  <td className="actions">
                    <Link to={`${editPath}/${item.id}`} className="edit-button">Editar</Link>
                    <button onClick={() => handleDelete(item.id)} className="delete-button">Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default GroupedListPage;
