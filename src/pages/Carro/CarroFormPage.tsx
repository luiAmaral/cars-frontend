// src/pages/Carro/CarroFormPage.tsx
import CrudFormPage from '../../components/crud/CrudFormPage';
import { getCarroById, createCarro, updateCarro, type Carro, type CarroCreate } from '../../services/api';

function CarroFormPage() {
  const carroApi = {
    getById: getCarroById,
    create: createCarro,
    update: updateCarro,
  };

  // Campos baseados na sua imagem do endpoint de criação
  const fields = [
    { name: 'modelo_id', label: 'ID do Modelo', type: 'number' as const },
    { name: 'ano', label: 'Ano', type: 'number' as const },
    { name: 'combustivel', label: 'Combustível', type: 'text' as const },
    { name: 'num_portas', label: 'Número de Portas', type: 'number' as const },
    { name: 'cor', label: 'Cor', type: 'text' as const },
  ];

  // Estado inicial para um novo carro
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