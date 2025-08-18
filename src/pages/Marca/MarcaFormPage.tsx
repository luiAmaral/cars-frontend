// src/pages/Marca/MarcaFormPage.tsx
import CrudFormPage from '../../components/crud/CrudFormPage';
import { getMarcaById, createMarca, updateMarca, type Marca, type MarcaCreate } from '../../services/api';



function MarcaFormPage() {
  
  // 1. Configuração da API
  const marcaApi = {
    getById: getMarcaById,
    create: createMarca,
    update: updateMarca,
  };

  // 2. Definição dos campos do formulário
  const fields = [
    {
      name: 'nome_marca',
      label: 'Nome da Marca',
      type: 'text' as const, // Usamos 'as const' para o TypeScript entender o tipo exato
    },
  ];

  // 3. Estado inicial para um novo formulário
    const initialState: MarcaCreate = {
    nome_marca: '',
  };

  return (
    <CrudFormPage<Marca>
      title="Marca"
      api={marcaApi}
      fields={fields}
      listPath="/marcas"
      initialState={initialState}
    />
  );
}

export default MarcaFormPage;