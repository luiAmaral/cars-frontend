import axios, { type AxiosResponse } from 'axios';

const apiClient = axios.create({
  baseURL: 'http://18.189.27.154:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Marca {
  id: number;
  nome_marca: string;
}
export type MarcaCreate = Omit<Marca, 'id'>;
export type MarcaUpdate = Partial<MarcaCreate>;

export interface Modelo {
  id: number;
  nome: string;
  marca_id: number;
  valor_fipe: number;
}
export type ModeloCreate = Omit<Modelo, 'id'>;
export type ModeloUpdate = Partial<ModeloCreate>;

export interface Carro {
  id: number;
  timestamp_cadastro: number;
  modelo_id: number;
  ano: number;
  combustivel: string;
  num_portas: number;
  cor: string;
  nome_modelo: string;
  valor: number;
  brand: number;
}
export type CarroCreate = Omit<Carro, 'id' | 'timestamp_cadastro' | 'nome_modelo' | 'brand'>;
export type CarroUpdate = Partial<CarroCreate>;

//endpoints marca
export const getMarcas = (skip = 0, limit = 100): Promise<AxiosResponse<Marca[]>> => 
  apiClient.get(`/marcas/?skip=${skip}&limit=${limit}`);

export const getMarcaById = (marcaId: number | string): Promise<AxiosResponse<Marca>> =>
  apiClient.get(`/marcas/${marcaId}`);

export const createMarca = (marcaData: MarcaCreate): Promise<AxiosResponse<Marca>> => 
  apiClient.post('/marcas/', marcaData);

export const updateMarca = (marcaId: number | string, marcaData: Partial<MarcaCreate>): Promise<AxiosResponse<Marca>> =>
  apiClient.put(`/marcas/${marcaId}`, marcaData);

export const deleteMarca = (marcaId: number | string): Promise<void> => 
  apiClient.delete(`/marcas/${marcaId}`);

//endpoints modelo
export const getModelos = (skip = 0, limit = 100): Promise<AxiosResponse<Modelo[]>> => 
  apiClient.get(`/modelos/?skip=${skip}&limit=${limit}`);

export const getModeloById = (modeloId: number | string): Promise<AxiosResponse<Modelo>> =>
  apiClient.get(`/modelos/${modeloId}`);

export const createModelo = (modeloData: ModeloCreate): Promise<AxiosResponse<Modelo>> => 
  apiClient.post('/modelos/', modeloData);

export const updateModelo = (modeloId: number | string, modeloData: Partial<ModeloCreate>): Promise<AxiosResponse<Modelo>> =>
  apiClient.put(`/modelos/${modeloId}`, modeloData);

export const deleteModelo = (modeloId: number | string): Promise<void> => 
  apiClient.delete(`/modelos/${modeloId}`);

//endpoints carro
export const getCarros = (): Promise<AxiosResponse<{ cars: Carro[] }>> => 
  apiClient.get('/cars/'); 

export const getCarroById = (carroId: number | string): Promise<AxiosResponse<Carro>> =>
  apiClient.get(`/cars/${carroId}`);

export const createCarro = (carroData: CarroCreate): Promise<AxiosResponse<Carro>> => 
  apiClient.post('/cars/', carroData); 

export const updateCarro = (carroId: number | string, carroData: CarroUpdate): Promise<AxiosResponse<Carro>> =>
  apiClient.put(`/cars/${carroId}`, carroData);

export const deleteCarro = (carroId: number | string): Promise<void> => 
  apiClient.delete(`/cars/${carroId}`);