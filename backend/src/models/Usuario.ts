export interface Usuario {
  id: number;
  nome: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}
