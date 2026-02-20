export interface Tarefa {
  id: number;
  descricao: string;
  criado_por: number;
  criado_por_nome?: string;
  status_id: number;
  finalizado_em: Date | null;
  finalizado_por: number | null;
  created_at: Date;
  updated_at: Date;
}
