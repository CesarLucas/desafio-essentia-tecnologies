import { Router } from "express";
import { TarefasController } from "../controllers/Tarefas.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const controller = new TarefasController();

router.use(authMiddleware); 

router.get("/", controller.list);
router.post("/", controller.create);

export default router;
