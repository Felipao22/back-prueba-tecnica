const { Router } = require ("express");
const { getFacturasController, createFacturasController } = require("../controllers/facturaControllers");

const router = Router();

router.get("/", getFacturasController);

router.post("/", createFacturasController)

module.exports = router;

