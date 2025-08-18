/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/crud/CrudFormPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { AxiosResponse } from 'axios';
import './CrudFormPage.css';

// --- DEFINIÇÃO DOS TIPOS (VERSÃO FINAL E CORRIGIDA) ---

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select';
  options?: { value: any; label: string }[];
}

// Tipos genéricos mais específicos para os dados do formulário
type CreateData<T> = Omit<T, 'id'>;
type UpdateData<T> = Partial<CreateData<T>>;

// A interface da API agora usa esses tipos mais específicos
interface FormApiFunctions<T> {
  getById?: (id: number | string) => Promise<AxiosResponse<T>>;
  create: (data: CreateData<T>) => Promise<AxiosResponse<T>>;
  update?: (id: number | string, data: UpdateData<T>) => Promise<AxiosResponse<T>>;
}

interface CrudFormPageProps<T> {
  title: string;
  api: FormApiFunctions<T>;
  fields: FormField[];
  listPath: string;
  initialState: Partial<T>;
}

function CrudFormPage<T extends { id?: number | string }>({
  title,
  api,
  fields,
  listPath,
  initialState,
}: CrudFormPageProps<T>) {
  const [formData, setFormData] = useState<Partial<T>>(initialState);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const isEditMode = Boolean(id);

  // ==================== CORREÇÃO AQUI ====================
  useEffect(() => {
    const fetchItemForEdit = async () => {
      // A lógica agora está dentro de uma função async e as dependências foram corrigidas.
      if (isEditMode && id && api.getById) {
        try {
          const response = await api.getById(id);
          setFormData(response.data);
        } catch (error) {
          console.error(`Falha ao buscar dados para ${title} com id ${id}:`, error);
          alert("Não foi possível carregar os dados para edição.");
        }
      }
    };

    fetchItemForEdit();
  }, [id, isEditMode, api.getById, title]); // <-- Lista de dependências corrigida e estável

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode && api.update && id) {
        await api.update(id, formData as UpdateData<T>);
        alert('Item atualizado com sucesso!');
      } else {
        await api.create(formData as CreateData<T>);
        alert('Item criado com sucesso!');
      }
      navigate(listPath);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Ocorreu um erro desconhecido.';
      alert(`Erro: ${errorMessage}`);
      console.error(err);
    }
  };

  return (
    <div className="crud-form-page">
      <h1>{`${isEditMode ? 'Editar' : 'Criar'} ${title}`}</h1>
      <form onSubmit={handleSubmit} className="crud-form">
        
        {/* ==================== A CORREÇÃO ESTÁ AQUI ==================== */}
        {fields.map(field => (
          <div key={field.name} className="form-group">
            <label htmlFor={field.name}>{field.label}</label>
            
            {/* Adicionamos a lógica para verificar se o tipo do campo é 'select' */}
            {field.type === 'select' ? (
              <select
                id={field.name}
                name={field.name}
                value={(formData as any)[field.name] || ''}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Selecione uma opção</option>
                {field.options?.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              // Caso contrário, renderiza um input normal
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                value={(formData as any)[field.name] || ''}
                onChange={handleChange}
                required
              />
            )}
          </div>
        ))}
        <div className="form-actions">
          <button type="button" onClick={() => navigate(listPath)} className="cancel-button">Cancelar</button>
          <button type="submit" className="submit-button">Salvar</button>
        </div>
      </form>
    </div>
  );
}

export default CrudFormPage;