// src/pages/Marca/MarcaListPage.tsx
import CrudListPage from '../../components/crud/CrudListPage';
import { getMarcas, deleteMarca } from '../../services/api';
import type { Marca } from '../../services/api'; // Importe o tipo 'Marca'

function MarcaListPage() {
  const marcaApi = {
    getAll: getMarcas,
    delete: deleteMarca,
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Nome da Marca', accessor: 'nome_marca' },
  ];

  return (
    <CrudListPage<Marca>
      title="Gerenciar Marcas"
      api={marcaApi}
      columns={columns}
      addPath="/marcas/novo"
      editPath="/marcas/editar"
    />
  );
}

export default MarcaListPage;