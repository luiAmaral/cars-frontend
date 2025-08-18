// src/pages/Modelo/ModeloListPage.tsx
import CrudListPage from '../../components/crud/CrudListPage';
import { getModelos, deleteModelo } from '../../services/api';
import type { Modelo } from '../../services/api';

function ModeloListPage() {
  const modeloApi = {
    getAll: getModelos,
    delete: deleteModelo,
  };

  // Definimos as colunas que queremos exibir na tabela de modelos
  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Nome do Modelo', accessor: 'nome' },
    { header: 'ID da Marca', accessor: 'marca_id' }, // Mostra a qual marca o modelo pertence
  ];

  return (
    <CrudListPage<Modelo>
      title="Gerenciar Modelos"
      api={modeloApi}
      columns={columns}
      addPath="/modelos/novo"
      editPath="/modelos/editar"
    />
  );
}

export default ModeloListPage;