import { Router } from "express";
import * as clientsController from "../controllers/clients.controller.js";

const router = Router();

router.get("/", clientsController.getAll);
router.get("/:id", clientsController.getById);
router.post("/", clientsController.create);
router.put("/:id", clientsController.update);
router.delete("/:id", clientsController.remove);

export default router;
