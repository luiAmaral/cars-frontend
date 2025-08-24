/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../../components/common/Spinner';
import './CrudListPage.css';

interface Column {
  header: string;
  accessor: string;
}

interface ApiFunctions<T> {
  getAll: () => Promise<{ data: T[] | { [key: string]: T[] } }>;
  delete: (id: number | string) => Promise<void>;
}

interface CrudListPageProps<T> {
  title: string;
  api: ApiFunctions<T>;
  columns: Column[];
  addPath: string;
  editPath: string;
  dataAccessor?: string;
  groupBy?: keyof T;
  getGroupName?: (groupKey: any) => string;
  renderCell?: (item: T, column: Column) => React.ReactNode;
}

// --- COMPONENTE ---

function CrudListPage<T extends { id: number | string }>({
  title,
  api,
  columns,
  addPath,
  editPath,
  dataAccessor,
  groupBy,
  getGroupName,
  renderCell,
}: CrudListPageProps<T>) {

  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
          console.error("Erro: Os dados recebidos da API não são um array.", response.data);
          throw new Error("Formato de dados inválido recebido da API.");
        }
      } catch (err) {
        setError(`Falha ao carregar ${title.toLowerCase()}.`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [api, dataAccessor, title]); 

  const handleDelete = async (id: number | string) => {
    if (window.confirm('Tem certeza que deseja excluir este item?')) {
      try {
        await api.delete(id);
        alert('Item excluído com sucesso!');
        setItems(prevItems => prevItems.filter(item => item.id !== id));
      } catch (err: any) {
        alert(`Erro ao excluir o item: ${err.response?.data?.detail || err.message}`);
        console.error(err);
      }
    }
  };
  const groupedItems = useMemo(() => {
    if (!groupBy) return null;

    return items.reduce((acc, item) => {
      const groupKey = item[groupBy] as string | number;
      
      const groupName = getGroupName ? getGroupName(groupKey) : String(groupKey);
      
      if (!acc[groupName]) {
        acc[groupName] = [];
      }
      acc[groupName].push(item);
      return acc;
    }, {} as { [key: string]: T[] });
  }, [items, groupBy, getGroupName]);

  if (loading) return <Spinner />;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  const renderTable = (data: T[]) => (
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
        {data.map((item) => (
          <tr key={item.id}>
            {columns.map((col) => (
              <td key={col.accessor}>
                {renderCell ? renderCell(item, col) : String(item[col.accessor as keyof T])}
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
  );

  return (
    <div className="crud-list-page">
      <div className="header">
        <h1>{title}</h1>
        <Link to={addPath} className="add-button">Adicionar Novo</Link>
      </div>

      {/* Renderização Condicional: Agrupada ou Simples */}
      {groupedItems ? (
        Object.keys(groupedItems).map(groupName => (
          <div key={groupName} style={{ marginBottom: '2rem' }}>
            <h2>{groupName}</h2>
            {renderTable(groupedItems[groupName])}
          </div>
        ))
      ) : (
        renderTable(items)
      )}
    </div>
  );
}

export default CrudListPage;