// src/pages/Modelo/ModeloFormPage.tsx
import { useState, useEffect } from 'react'; // 1. IMPORTE useState e useEffect
import CrudFormPage from '../../components/crud/CrudFormPage';
import { 
  getModeloById, 
  createModelo, 
  updateModelo, 
  getMarcas, // 2. IMPORTE a função para buscar marcas
  type Modelo, 
  type ModeloCreate,
  type Marca // Importe o tipo Marca também
} from '../../services/api';

function ModeloFormPage() {
  // 3. CRIE UM ESTADO PARA ARMAZENAR A LISTA DE MARCAS
  const [marcas, setMarcas] = useState<Marca[]>([]);

  const modeloApi = {
    getById: getModeloById,
    create: createModelo,
    update: updateModelo,
  };

  // 4. USE o useEffect PARA BUSCAR AS MARCAS QUANDO A PÁGINA CARREGAR
  useEffect(() => {
    // Busca a lista de todas as marcas para preencher o dropdown
    getMarcas()
      .then(response => {
        setMarcas(response.data);
      })
      .catch(error => {
        console.error("Erro ao buscar marcas:", error);
        alert("Não foi possível carregar a lista de marcas.");
      });
  }, []); // O array vazio [] garante que isso rode apenas uma vez

  // 5. ATUALIZE A DEFINIÇÃO DO CAMPO 'marca_id'
  const fields = [
    {
      name: 'nome',
      label: 'Nome do Modelo',
      type: 'text' as const,
    },
    {
      name: 'marca_id',
      label: 'Marca', // O rótulo agora é mais amigável
      type: 'select' as const, // Mude o tipo para 'select'
      // A nova propriedade 'options' mapeia a lista de marcas para o formato que o formulário espera
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