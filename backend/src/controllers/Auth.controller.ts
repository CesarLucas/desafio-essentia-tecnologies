import { Request, Response } from "express";
import { AuthService, HttpError } from "../services/Auth.service";

export class AuthController {
  constructor(private service = new AuthService()) {}

  register = async (req: Request, res: Response) => {
    try {
      const { nome, email, senha } = req.body;
      const user = await this.service.register(nome, email, senha);
      res.status(201).json(user);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, senha } = req.body;
      const result = await this.service.login(email, senha);
      res.json(result);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  updatePassword = async (req: Request, res: Response) => {
    try {
      const { email, novaSenha } = req.body;
      const result = await this.service.updatePassword(email, novaSenha);
      res.json(result);
    } catch (error) {
      this.handleError(res, error);
    }
  };

  private handleError(res: Response, error: unknown) {
    if (error instanceof HttpError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    return res.status(500).json({ message: "Erro interno do servidor" });
  }
}
