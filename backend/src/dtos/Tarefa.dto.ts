export interface CreateTarefaDto {
  descricao: string;
  vencimento_em: string;
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
  message: string;
}
