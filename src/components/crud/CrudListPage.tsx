/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/crud/CrudListPage.tsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CrudListPage.css';

// --- DEFINIÇÃO DOS TIPOS ---

interface Column {
  header: string;
  accessor: string;
}

interface ApiFunctions<T> {
  getAll: () => Promise<{ data: any }>; // Mudamos para 'any' para ser mais flexível
  delete: (id: number | string) => Promise<void>;
}

// MUDANÇA 1: Adicionar a nova prop opcional 'dataAccessor'
interface CrudListPageProps<T> {
  title: string;
  api: ApiFunctions<T>;
  columns: Column[];
  addPath: string;
  editPath: string;
  dataAccessor?: string; // <-- NOVA PROP OPCIONAL
}

function CrudListPage<T extends { id: number | string }>({
  title,
  api,
  columns,
  addPath,
  editPath,
  dataAccessor, // <-- MUDANÇA 2: Receber a nova prop aqui
}: CrudListPageProps<T>) {

  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.getAll();
      
      // MUDANÇA 3: Substituir a lógica hardcoded por uma lógica 100% genérica
      // Esta é a principal alteração.
      const data = dataAccessor && response.data && response.data[dataAccessor]
        ? response.data[dataAccessor]
        : response.data;
      
      // Validação para garantir que 'data' é um array antes de setar o estado
      if (Array.isArray(data)) {
        setItems(data);
      } else {
        // Se não for um array, algo está errado com a resposta da API ou com o dataAccessor
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

  useEffect(() => {
    fetchData();
  }, [title]); // A dependência pode ser mantida ou removida dependendo do caso de uso

  const handleDelete = async (id: number | string) => {
    if (window.confirm('Tem certeza que deseja excluir este item?')) {
      try {
        await api.delete(id);
        alert('Item excluído com sucesso!');
        fetchData(); 
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