// src/pages/Modelo/ModeloFormPage.tsx
import CrudFormPage from '../../components/crud/CrudFormPage';
import { getModeloById, createModelo, updateModelo, type Modelo, type ModeloCreate } from '../../services/api';

function ModeloFormPage() {
  const modeloApi = {
    getById: getModeloById,
    create: createModelo,
    update: updateModelo,
  };

  // Definimos os campos que nosso formulário terá
  const fields = [
    {
      name: 'nome',
      label: 'Nome do Modelo',
      type: 'text' as const,
    },
    {
      name: 'marca_id',
      label: 'ID da Marca',
      type: 'number' as const,
    },
    {
        name: 'valor_fipe',
        label: 'Valor FIPE',
        type: 'number' as const,
    }
  ];

  // Estado inicial para um novo modelo
  const initialState: ModeloCreate = {
    nome: '',
    marca_id: 0, // Ou 1, se preferir um valor padrão
    valor_fipe: 0, // Valor padrão para o campo de valor FIPE
  };

  return (
    <CrudFormPage<Modelo>
      title="Modelo"
      api={modeloApi}
      fields={fields}
      listPath="/modelos"
      initialState={initialState}
    />
  );
}

export default ModeloFormPage;