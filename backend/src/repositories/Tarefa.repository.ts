import { pool } from "../db/pool";
import { Tarefa } from "../models/Tarefa";

export class TarefaRepository {
  async findAll(): Promise<Tarefa[]> {
    const [rows] = await pool.query(
      `SELECT t.id, t.descricao, t.criado_por, u.nome AS criado_por_nome, t.status_id, t.finalizado_em, t.finalizado_por, t.created_at, t.updated_at
       FROM tarefa t
       INNER JOIN usuario u ON u.id = t.criado_por
       ORDER BY t.id DESC`
    );
    return rows as Tarefa[];
  }

  async findAllByUser(userId: number): Promise<Tarefa[]> {
    const [rows] = await pool.query(
      `SELECT t.id, t.descricao, t.criado_por, u.nome AS criado_por_nome, t.status_id, t.finalizado_em, t.finalizado_por, t.created_at, t.updated_at
       FROM tarefa t
       INNER JOIN usuario u ON u.id = t.criado_por
       WHERE t.criado_por = ?
       ORDER BY t.id DESC`,
      [userId]
    );
    return rows as Tarefa[];
  }

  async create(userId: number, descricao: string, statusId: number): Promise<number> {
    const [result] = await pool.execute(
      `INSERT INTO tarefa (descricao, criado_por, status_id) VALUES (?, ?, ?)`,
      [descricao, userId, statusId]
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (result as any).insertId as number;
  }

  async update(userId: number, taskId: number, fields: { descricao?: string; status_id?: number; finalizado_por?: number | null; }): Promise<boolean> {
    const sets: string[] = [];
    const values: unknown[] = [];

    if (fields.descricao !== undefined) { sets.push("descricao = ?"); values.push(fields.descricao); }
    if (fields.status_id !== undefined) { sets.push("status_id = ?"); values.push(fields.status_id); }

    if (fields.status_id === 1) {
      sets.push("finalizado_em = CURRENT_TIMESTAMP");
      if (fields.finalizado_por !== undefined) { sets.push("finalizado_por = ?"); values.push(fields.finalizado_por); }
    } else if (fields.status_id !== undefined && fields.status_id !== 1) {
      sets.push("finalizado_em = NULL");
      sets.push("finalizado_por = NULL");
    }

    if (!sets.length) return false;

    values.push(taskId, userId);

    const [result] = await pool.execute(
      `UPDATE tarefa SET ${sets.join(", ")}
       WHERE id = ? AND criado_por = ?`,
      values
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ((result as any).affectedRows as number) > 0;
  }

  async updateStatusAnyUser(taskId: number, statusId: number, finalizadoPor: number): Promise<boolean> {
    const sets: string[] = ["status_id = ?"];
    const values: unknown[] = [statusId];

    if (statusId === 1) {
      sets.push("finalizado_em = CURRENT_TIMESTAMP");
      sets.push("finalizado_por = ?");
      values.push(finalizadoPor);
    } else {
      sets.push("finalizado_em = NULL");
      sets.push("finalizado_por = NULL");
    }

    values.push(taskId);

    const [result] = await pool.execute(
      `UPDATE tarefa SET ${sets.join(", ")}
       WHERE id = ?`,
      values
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ((result as any).affectedRows as number) > 0;
  }

  async delete(userId: number, taskId: number): Promise<boolean> {
    const [result] = await pool.execute(
      `DELETE FROM tarefa WHERE id = ? AND criado_por = ?`,
      [taskId, userId]
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ((result as any).affectedRows as number) > 0;
  }
}
