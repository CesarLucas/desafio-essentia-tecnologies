export interface CreateTarefaDto {
  descricao: string;
  status_id: number;
}

export interface UpdateTarefaStatusDto {
  status_id: number;
}

export interface UpdateTarefaDescricaoDto {
  descricao: string;
}

export interface TarefaResponseDto {
  id?: number;
  message: string
}
