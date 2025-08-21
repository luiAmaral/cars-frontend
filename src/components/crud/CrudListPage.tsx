/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CrudListPage.css';
import Spinner from '../../components/common/Spinner';

// --- DEFINIÇÃO DOS TIPOS ---

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
  renderCell?: (row: any, column: any) => any;  // Adicionando a propriedade renderCell
}

function CrudListPage<T extends { id: number | string }>({
  title,
  api,
  columns,
  addPath,
  editPath,
  dataAccessor, 
  renderCell,
}: CrudListPageProps<T>) {

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
        fetchData(); 
      } catch (err: any) {
        alert(`Erro ao excluir o item: ${err.response?.data?.detail || err.message}`);
        console.error(err);
      }
    }
  };

  if (loading) return <Spinner />;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="crud-list-page">
      <div className="header">
        <h1>{title}</h1>
        <Link to={addPath} className="add-button">
          Adicionar Novo
        </Link>
      </div>
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
          {items.map((item) => (
            <tr key={item.id}>
              {columns.map((col) => (
                <td key={col.accessor}>
                  {/* Aplica renderCell se estiver definido */}
                  {renderCell ? renderCell(item, col) : String(item[col.accessor as keyof T])}
                </td>
              ))}
              <td className="actions">
                <Link to={`${editPath}/${item.id}`} className="edit-button">
                  Editar
                </Link>
                <button onClick={() => handleDelete(item.id)} className="delete-button">
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CrudListPage;