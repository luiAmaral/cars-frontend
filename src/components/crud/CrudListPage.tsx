// src/components/Crud/CrudListPage.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CrudListPage.css';

// --- DEFINIÇÃO DOS TIPOS ---

interface Column {
  header: string;
  accessor: string;
}

interface ApiFunctions<T> {
  getAll: () => Promise<{ data: T[] | { cars: T[] } }>; // A resposta pode ser um array de T ou um objeto {cars: T[]}
  delete: (id: number | string) => Promise<void>;
}

// MUDANÇA 2: As props do componente também se tornam genéricas com <T>
interface CrudListPageProps<T> {
  title: string;
  api: ApiFunctions<T>;
  columns: Column[];
  addPath: string;
  editPath: string;
}

// MUDANÇA 3: O componente agora é uma função genérica.
// Ele aceita um tipo T que DEVE ter uma propriedade 'id'.
function CrudListPage<T extends { id: number | string }>({
  title,
  api,
  columns,
  addPath,
  editPath,
}: CrudListPageProps<T>) {

  // O estado 'items' agora é fortemente tipado com T
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.getAll();
      
      // Verifica se a resposta tem a propriedade 'cars' e extrai o array correto
      const data = 'cars' in response.data ? response.data.cars : response.data;
      setItems(data);

    } catch (err) {
      setError(`Falha ao carregar ${title.toLowerCase()}.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [title]);

  const handleDelete = async (id: number | string) => {
    if (window.confirm('Tem certeza que deseja excluir este item?')) {
      try {
        await api.delete(id);
        alert('Item excluído com sucesso!');
        fetchData(); // Recarrega a lista
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        alert(`Erro ao excluir o item: ${err.response?.data?.detail || err.message}`);
        console.error(err);
      }
    }
  };

  if (loading) return <p>Carregando...</p>;
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
                // Usamos 'as keyof T' para garantir ao TypeScript que o accessor é uma chave válida do item
                <td key={col.accessor}>{String(item[col.accessor as keyof T])}</td>
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