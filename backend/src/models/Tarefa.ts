export interface Tarefa {
  id: number;
  descricao: string;
  criado_por: number;
  status_id: number;
  finalizado_em: Date | null;
  finalizado_por: number | null;
  created_at: Date;
  updated_at: Date;
}
