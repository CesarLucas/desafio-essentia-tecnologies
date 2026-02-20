export interface CreateTarefaDto {
  descricao: string;
  status_id: number;
}

export interface UpdateTarefaStatusDto {
  status_id: number;
}

export interface TarefaResponseDto {
  id?: number;
  message: string
}
