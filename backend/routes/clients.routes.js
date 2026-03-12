const { Router } = require("express");
const clientsController = require("../controllers/clients.controller");

const router = Router();

router.get("/", clientsController.getAll);
router.get("/:id", clientsController.getById);
router.post("/", clientsController.create);
router.put("/:id", clientsController.update);
router.delete("/:id", clientsController.remove);

module.exports = router;
