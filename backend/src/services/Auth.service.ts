import "../config/load-env";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { UsuarioRepository } from "../repositories/Usuario.repository";
import { env } from "process";

export class HttpError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

export class AuthService {
  constructor(private users = new UsuarioRepository()) {}

  async register(nome: string, email: string, senha: string) {
    const existingUser = await this.users.findByEmail(email);
    if (existingUser) {
      throw new HttpError(400, "Email ja cadastrado");
    }

    const password_hash = await bcrypt.hash(senha, 10);
    const userId = await this.users.create(nome, email, password_hash);

    return { id: userId, nome, email };
  }

  async login(email: string, senha: string) {
    const user = await this.users.findByEmail(email);
    if (!user) {
      throw new HttpError(401, "Email ou senha invalidos");
    }

    const passwordMatch = await bcrypt.compare(senha, user.password_hash);
    if (!passwordMatch) {
      throw new HttpError(401, "Email ou senha invalidos");
    }

    if (!env.JWT_SECRET) {
      throw new HttpError(500, "JWT_SECRET nao configurado");
    }

    const signOptions: jwt.SignOptions = {};
    if (env.JWT_EXPIRES_IN) {
      signOptions.expiresIn = env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"];
    }

    const token = jwt.sign({ userId: user.id, nome: user.nome }, env.JWT_SECRET, signOptions);
    return { token };
  }

  async updatePassword(email: string, novaSenha: string) {
    const user = await this.users.findByEmail(email);
    if (!user) {
      throw new HttpError(404, "Usuario nao encontrado");
    }

    const password_hash = await bcrypt.hash(novaSenha, 10);
    await this.users.updatePasswordByEmail(email, password_hash);

    return { message: "Senha atualizada com sucesso" };
  }
}
