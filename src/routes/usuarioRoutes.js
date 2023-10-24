const { Router } = require("express");
const { getUserController, updateUserController, getUserByUsuarioId, createUserController, loginController, logOutController } = require("../controllers/usuarioControllers");

const router = Router();

router.get("/", getUserController);

router.post("/", createUserController)

router.put("/:idUsuario", updateUserController);

router.get("/:idUsuario", getUserByUsuarioId);

router.post("/login", loginController)

router.post("logout", logOutController)



module.exports = router;
