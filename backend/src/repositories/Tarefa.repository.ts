import { pool } from "../db/pool";
import { Tarefa } from "../models/Tarefa";

export class TarefaRepository {
  async findAllByUser(userId: number): Promise<Tarefa[]> {
    const [rows] = await pool.query(
      `SELECT id, descricao, criado_por, status_id, finalizado_em, finalizado_por, created_at, updated_at
       FROM tarefa
       WHERE criado_por = ?
       ORDER BY id DESC`,
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

  async delete(userId: number, taskId: number): Promise<boolean> {
    const [result] = await pool.execute(
      `DELETE FROM tarefa WHERE id = ? AND criado_por = ?`,
      [taskId, userId]
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ((result as any).affectedRows as number) > 0;
  }
}
