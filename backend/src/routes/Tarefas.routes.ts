import { Router } from "express";
import { TarefasController } from "../controllers/Tarefas.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const controller = new TarefasController();

router.use(authMiddleware); 

router.get("/", controller.list);
router.get("/todas", controller.listAll);
router.post("/", controller.create);
router.patch("/:id/status", controller.updateStatus);
router.patch("/:id/descricao", controller.updateDescription);
router.delete("/:id", controller.remove);

export default router;
