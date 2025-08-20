/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useMemo } from 'react'; // Adicionamos useMemo
import { Link } from 'react-router-dom';
import { getCarros, getMarcas, getModelos, deleteCarro } from '../../services/api';
import type { Carro, Marca, Modelo } from '../../services/api';
import '../../components/crud/CrudListPage.css';

interface DadosDaPagina {
  carros: Carro[];
  marcas: Marca[];
  modelos: Modelo[];
}

function CarroListPage() {
  const [dados, setDados] = useState<DadosDaPagina | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [carrosResponse, marcasResponse, modelosResponse] = await Promise.all([
        getCarros(),
        getMarcas(),
        getModelos(),
      ]);
      
      // Armazenamos os dados brutos em um único objeto de estado
      setDados({
        carros: carrosResponse.data.cars,
        marcas: marcasResponse.data,
        modelos: modelosResponse.data,
      });

    } catch (err) {
      setError('Falha ao carregar os dados.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number | string) => {
    if (window.confirm('Tem certeza que deseja excluir este carro?')) {
      try {
        await deleteCarro(id);
        alert('Carro excluído com sucesso!');
        fetchData(); // Apenas recarrega todos os dados
      } catch (err: any) {
        alert(`Erro ao excluir o carro: ${err.response?.data?.detail || err.message}`);
      }
    }
  };

  // SIMPLIFICAÇÃO 2: A lógica de agrupamento e mapeamento sai do 'fetchData'
  // e entra aqui, usando 'useMemo' para evitar recálculos desnecessários.
  const carrosAgrupados = useMemo(() => {
    if (!dados) return {};

    // A lógica de reduce continua a mesma, mas agora ela depende do estado 'dados'.
    return dados.carros.reduce((acc, carro) => {
      // **ATENÇÃO:** Substitua 'brand' pelo nome exato do campo no seu objeto Carro!
      const marcaDoCarro = dados.marcas.find(m => m.id === carro.brand);
      const nomeMarca = marcaDoCarro?.nome_marca || 'Marca Desconhecida';
      
      if (!acc[nomeMarca]) {
        acc[nomeMarca] = [];
      }
      acc[nomeMarca].push(carro);
      return acc;
    }, {} as { [nomeMarca: string]: Carro[] });

  }, [dados]); // Esta lógica só será executada novamente se o estado 'dados' mudar.


  if (loading) return <p>Carregando...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!dados) return <p>Nenhum dado encontrado.</p>; // Uma checagem de segurança

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
              {carrosAgrupados[nomeMarca].map(carro => {
                // SIMPLIFICAÇÃO 3: A busca do nome do modelo é feita aqui, na hora.
                // Usamos '.find()' que é mais simples de ler que o Map.
                // **ATENÇÃO:** Substitua 'modelo_id' pelo nome exato do campo no seu objeto Carro!
                const modeloDoCarro = dados.modelos.find(m => m.id === carro.modelo_id);
                const nomeModelo = modeloDoCarro?.nome || 'Modelo Desconhecido';

                return (
                  <tr key={carro.id}>
                    <td>{nomeModelo}</td>
                    <td>{carro.ano}</td>
                    <td>{carro.cor}</td>
                    <td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(carro.valor)}</td>
                    <td className="actions">
                      <Link to={`/carros/editar/${carro.id}`} className="edit-button">Editar</Link>
                      <button onClick={() => handleDelete(carro.id)} className="delete-button">Excluir</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default CarroListPage;