import { pool } from "../db/pool";
import { Usuario } from "../models/Usuario";

export class UsuarioRepository {
  async findByEmail(email: string): Promise<Usuario | null> {
    const [rows] = await pool.execute(
      `SELECT id, nome, email, password_hash, created_at, updated_at
       FROM usuario WHERE email = ?
       LIMIT 1`,
      [email]
    );
    const arr = rows as Usuario[];
    return arr[0] ?? null;
  }

  async create(nome: string, email: string, password_hash: string): Promise<number> {
    const [result] = await pool.execute(
      `INSERT INTO usuario (nome, email, password_hash) VALUES (?, ?, ?)`,
      [nome, email, password_hash]
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (result as any).insertId as number;
  }

  async updatePasswordByEmail(email: string, password_hash: string): Promise<boolean> {
    const [result] = await pool.execute(
      `UPDATE usuario SET password_hash = ? WHERE email = ?`,
      [password_hash, email]
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ((result as any).affectedRows as number) > 0;
  }
}
