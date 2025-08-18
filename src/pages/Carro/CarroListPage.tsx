/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/Carro/CarroListPage.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCarros, getMarcas, deleteCarro } from '../../services/api';
import type { Carro, Marca } from '../../services/api';
import '../../components/crud/CrudListPage.css'; // Reutilizando o estilo

// Criando um tipo para os dados agrupados
type CarrosAgrupados = {
  [nomeMarca: string]: Carro[];
};

// A função do componente começa aqui
function CarroListPage() {
  // Toda a lógica, estados e efeitos devem ficar DENTRO da função
  const [carrosAgrupados, setCarrosAgrupados] = useState<CarrosAgrupados>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Colocamos a função de busca de dados aqui dentro para que ela tenha acesso a setLoading, setError, etc.
  const fetchData = async () => {
    try {
      setLoading(true);
      const [carrosResponse, marcasResponse] = await Promise.all([getCarros(), getMarcas()]);
      
      const carros = carrosResponse.data.cars;
      const marcas: Marca[] = marcasResponse.data;

      // --- INÍCIO DA DEPURAÇÃO ---
      console.log("Carros recebidos da API:", carros);
      console.log("Marcas recebidas da API:", marcas);
      // --- FIM DA DEPURAÇÃO ---

      const marcasMap = new Map(marcas.map(marca => [marca.id, marca.nome_marca]));

      // --- MAIS DEPURAÇÃO ---
      console.log("Mapa de marcas criado:", marcasMap);
      // --- FIM DA DEPURAÇÃO ---

      const agrupado = carros.reduce((acc, carro) => {
        const nomeMarca = marcasMap.get(carro.brand) || 'Marca Desconhecida';
        if (!acc[nomeMarca]) {
          acc[nomeMarca] = [];
        }
        acc[nomeMarca].push(carro);
        return acc;
      }, {} as CarrosAgrupados);

      setCarrosAgrupados(agrupado);
    } catch (err) {
      setError('Falha ao carregar os dados.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // O array vazio garante que a busca de dados aconteça apenas uma vez, quando o componente montar

  const handleDelete = async (id: number | string) => {
    if (window.confirm('Tem certeza que deseja excluir este carro?')) {
      try {
        await deleteCarro(id);
        alert('Carro excluído com sucesso!');
        fetchData(); // Recarrega a lista após a exclusão
      } catch (err: any) {
        alert(`Erro ao excluir o carro: ${err.response?.data?.detail || err.message}`);
      }
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  // O JSX a ser renderizado também deve estar dentro da função
  return (
    <div className="crud-list-page">
      <div className="header">
        <h1>Gerenciar Carros</h1>
        <Link to="/carros/novo" className="add-button">Adicionar Novo</Link>
      </div>

      {Object.keys(carrosAgrupados).map(nomeMarca => (
        <div key={nomeMarca} style={{ marginBottom: '2rem' }}>
          <h2>{nomeMarca}</h2>
          <table className="crud-table">
            <thead>
              <tr>
                <th>Modelo</th>
                <th>Ano</th>
                <th>Cor</th>
                <th>Valor</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {carrosAgrupados[nomeMarca].map(carro => (
                <tr key={carro.id}>
                  <td>{carro.nome_modelo}</td>
                  <td>{carro.ano}</td>
                  <td>{carro.cor}</td>
                  <td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(carro.valor)}</td>
                  <td className="actions">
                    <Link to={`/carros/editar/${carro.id}`} className="edit-button">Editar</Link>
                    <button onClick={() => handleDelete(carro.id)} className="delete-button">Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default CarroListPage;