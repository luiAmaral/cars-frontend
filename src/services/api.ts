// src/services/api.ts
import axios, { type AxiosResponse } from 'axios';

// -------------------------------------------------------------------
// Configuração do Cliente API
// -------------------------------------------------------------------

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000', // A URL base da sua API
  headers: {
    'Content-Type': 'application/json',
  },
});

// -------------------------------------------------------------------
// Definições de Tipos (Interfaces e Tipos Derivados)
// -------------------------------------------------------------------

// --- Marca ---
export interface Marca {
  id: number;
  nome_marca: string;
}
export type MarcaCreate = Omit<Marca, 'id'>;
export type MarcaUpdate = Partial<MarcaCreate>;

// --- Modelo ---
export interface Modelo {
  id: number;
  nome: string;
  marca_id: number;
  valor_fipe: number;
}
export type ModeloCreate = Omit<Modelo, 'id'>;
export type ModeloUpdate = Partial<ModeloCreate>;

// --- Carro ---
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
  brand: number; // ID da marca do carro
}
// Usando 'Omit' para consistência e para remover campos gerados pelo backend
export type CarroCreate = Omit<Carro, 'id' | 'timestamp_cadastro' | 'nome_modelo' | 'brand'>;
export type CarroUpdate = Partial<CarroCreate>;


// ===================================================================
// --- Marcas ---
// ===================================================================

export const getMarcas = (skip = 0, limit = 100): Promise<AxiosResponse<Marca[]>> => 
  apiClient.get(`/marcas?skip=${skip}&limit=${limit}`);

export const getMarcaById = (marcaId: number | string): Promise<AxiosResponse<Marca>> =>  // <-- CORREÇÃO AQUI
  apiClient.get(`/marcas/${marcaId}`);

export const createMarca = (marcaData: MarcaCreate): Promise<AxiosResponse<Marca>> => 
  apiClient.post('/marcas', marcaData);

export const updateMarca = (marcaId: number | string, marcaData: Partial<MarcaCreate>): Promise<AxiosResponse<Marca>> => // <-- CORREÇÃO AQUI
  apiClient.put(`/marcas/${marcaId}`, marcaData);

export const deleteMarca = (marcaId: number | string): Promise<void> => 
  apiClient.delete(`/marcas/${marcaId}`);


// ===================================================================
// --- Modelos ---
// ===================================================================

export const getModelos = (skip = 0, limit = 100): Promise<AxiosResponse<Modelo[]>> => 
  apiClient.get(`/modelos?skip=${skip}&limit=${limit}`);

export const getModeloById = (modeloId: number | string): Promise<AxiosResponse<Modelo>> => // <-- CORREÇÃO AQUI
  apiClient.get(`/modelos/${modeloId}`);

export const createModelo = (modeloData: ModeloCreate): Promise<AxiosResponse<Modelo>> => 
  apiClient.post('/modelos', modeloData);

export const updateModelo = (modeloId: number | string, modeloData: Partial<ModeloCreate>): Promise<AxiosResponse<Modelo>> => // <-- CORREÇÃO AQUI
  apiClient.put(`/modelos/${modeloId}`, modeloData);

export const deleteModelo = (modeloId: number | string): Promise<void> => 
  apiClient.delete(`/modelos/${modeloId}`);


// ===================================================================
// --- Carros ---
// ===================================================================

export const getCarros = (): Promise<AxiosResponse<{ cars: Carro[] }>> => 
  apiClient.get('/cars');

export const getCarroById = (carroId: number | string): Promise<AxiosResponse<Carro>> => // <-- CORREÇÃO AQUI
  apiClient.get(`/cars/${carroId}`);

export const createCarro = (carroData: CarroCreate): Promise<AxiosResponse<Carro>> => 
  apiClient.post('/cars', carroData);

export const updateCarro = (carroId: number | string, carroData: CarroUpdate): Promise<AxiosResponse<Carro>> => // <-- CORREÇÃO AQUI
  apiClient.put(`/cars/${carroId}`, carroData);

export const deleteCarro = (carroId: number | string): Promise<void> => 
  apiClient.delete(`/cars/${carroId}`);