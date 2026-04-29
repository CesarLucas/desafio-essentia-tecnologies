import { Router } from "express";
import { AuthController } from "../controllers/Auth.controller";

const router = Router();
const controller = new AuthController();

router.post("/criar-usuario", controller.register);
router.post("/login", controller.login);
router.patch("/atualizar-senha", controller.updatePassword);

export default router;
