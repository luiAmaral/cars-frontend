import { useState, useEffect } from 'react';
import CrudFormPage from '../../components/crud/CrudFormPage';
import { 
  getModeloById, 
  createModelo, 
  updateModelo, 
  getMarcas,
  type Modelo, 
  type ModeloCreate,
  type Marca
} from '../../services/api';

function ModeloFormPage() {
  const [marcas, setMarcas] = useState<Marca[]>([]);

  const modeloApi = {
    getById: getModeloById,
    create: createModelo,
    update: updateModelo,
  };

  useEffect(() => {
    getMarcas()
      .then(response => {
        setMarcas(response.data);
      })
      .catch(error => {
        console.error("Erro ao buscar marcas:", error);
        alert("Não foi possível carregar a lista de marcas.");
      });
  }, []); 

  const fields = [
    {
      name: 'nome',
      label: 'Nome do Modelo',
      type: 'text' as const,
    },
    {
      name: 'marca_id',
      label: 'Marca',
      type: 'select' as const,
      
      options: marcas.map(marca => ({
        value: marca.id,
        label: marca.nome_marca,
      })),
    },
    {
      name: 'valor_fipe',
      label: 'Valor FIPE',
      type: 'number' as const,
    },
  ];

  const initialState: ModeloCreate = {
    nome: '',
    marca_id: 0,
    valor_fipe: 0,
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