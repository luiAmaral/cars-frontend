// src/pages/Carro/CarroFormPage.tsx
import { useState, useEffect } from 'react'; // 1. IMPORTE useState e useEffect
import CrudFormPage from '../../components/crud/CrudFormPage';
import {
  getCarroById,
  createCarro,
  updateCarro,
  getModelos, // 2. IMPORTE a função para buscar modelos
  type Carro,
  type CarroCreate,
  type Modelo, // Importe o tipo Modelo também
} from '../../services/api';

function CarroFormPage() {
  // 3. CRIE UM ESTADO PARA ARMAZENAR A LISTA DE MODELOS
  const [modelos, setModelos] = useState<Modelo[]>([]);

  const carroApi = {
    getById: getCarroById,
    create: createCarro,
    update: updateCarro,
  };

  // 4. USE o useEffect PARA BUSCAR OS MODELOS QUANDO A PÁGINA CARREGAR
  useEffect(() => {
    getModelos()
      .then(response => {
        setModelos(response.data);
      })
      .catch(error => {
        console.error("Erro ao buscar modelos:", error);
        alert("Não foi possível carregar a lista de modelos.");
      });
  }, []);

  // 5. ATUALIZE A DEFINIÇÃO DO CAMPO 'modelo_id'
  const fields = [
    {
      name: 'modelo_id',
      label: 'Modelo', // Rótulo amigável
      type: 'select' as const, // Mude para 'select'
      // Mapeia a lista de modelos para as opções do dropdown
      options: modelos.map(modelo => ({
        value: modelo.id,
        label: modelo.nome, // Usamos o nome do modelo para exibição
      })),
    },
    { name: 'ano', label: 'Ano', type: 'number' as const },
    { name: 'combustivel', label: 'Combustível', type: 'text' as const },
    { name: 'num_portas', label: 'Número de Portas', type: 'number' as const },
    { name: 'cor', label: 'Cor', type: 'text' as const },
  ];

  const initialState: CarroCreate = {
    modelo_id: 0,
    ano: new Date().getFullYear(),
    combustivel: '',
    num_portas: 4,
    cor: '',
    valor: 0, // Valor padrão para o campo de valor
  };

  return (
    <CrudFormPage<Carro>
      title="Carro"
      api={carroApi}
      fields={fields}
      listPath="/carros"
      initialState={initialState}
    />
  );
}

export default CarroFormPage;