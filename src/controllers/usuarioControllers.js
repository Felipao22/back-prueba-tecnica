const { Usuario, Factura } = require("../db");

async function getUserController(req, res) {
  try {
    const dbUsers = await Usuario.findAll({
      include: [{ model: Factura }],
    });

    if (!dbUsers || dbUsers.length === 0) {
      return res
        .status(404)
        .send("No se encontraron usuarios en la base de datos");
    }

    res.status(200).send(dbUsers);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function createUserController(req, res) {
  const { nombre, userName, apellido, password } = req.body;

  if (!nombre || !userName || !apellido || !password) {
    return res
      .status(400)
      .json({ message: "Debe proporcionar todos los campos requeridos." });
  }

  try {
    const existingUser = await Usuario.findOne({
      where: { userName: userName },
    });

    if (existingUser) {
      return res.status(409).json({ message: "El usuario ya existe" });
    }

    const newUser = await Usuario.create({
      nombre: nombre,
      userName: userName,
      apellido: apellido,
      password: password,
    });

    res.status(201).json({ message: "Usuario creado", newUser });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function updateUserController(req, res) {
  const { idUsuario } = req.params;
  const modification = req.body;

  if (!idUsuario) {
    return res
      .status(400)
      .json({ message: "El párametro idUsuario es requerido" });
  }

  try {
    const existingUser = await Usuario.findOne({
      where: { idUsuario: idUsuario },
    });

    if (!existingUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (
      modification.userName &&
      modification.userName !== existingUser.userName
    ) {
      const userWithNewUserName = await Usuario.findOne({
        where: { userName: modification.userName },
      });

      if (userWithNewUserName) {
        return res.status(400).json({ message: "El Usuario ya existe" });
      }
    }

    const [numUpdatedRows] = await Usuario.update(modification, {
      where: { idUsuario: idUsuario },
    });

    if (numUpdatedRows === 1) {
      return res
        .status(200)
        .json({ message: "Usuario modificado", modification });
    } else {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function getUserByUsuarioId(req, res) {
  const { idUsuario } = req.params;

  if (!idUsuario) {
    return res
      .status(400)
      .json({ message: "El párametro idUsuario es requerido" });
  }

  try {
    const foundUsers = await Usuario.findByPk(idUsuario, {
      include: [{ model: Factura }],
    });

    if (foundUsers) {
      return res.status(200).json(foundUsers);
    } else {
      return res
        .status(404)
        .json({ message: "No se encontró el usuario solicitado" });
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function loginController(req, res) {
  const { userName, password } = req.body;

  try {
    const userLogin = await Usuario.findOne({
      where: { userName },
      include: [{ model: Factura }],
    });

    if (!userLogin) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    } else if (password !== userLogin.password) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    return res.status(200).json({
      message: `Has inicidado sesión con éxito ${userLogin.userName}`,
      user: userLogin,
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function logOutController(req, res) {
  try {
    return res.status(200).json({ message: "Has cerrado sesión con éxito" });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function changePasswordController(req, res) {
  const { userName } = req.params;
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await Usuario.findOne({
      where: { userName },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    } else if (user.password !== oldPassword) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    } else {
      await Usuario.update({ password: newPassword }, { where: { userName } });
      return res
        .status(200)
        .json({ message: "Contraseña actualizada correctamente" });
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

module.exports = {
  getUserController,
  updateUserController,
  getUserByUsuarioId,
  createUserController,
  loginController,
  logOutController,
  changePasswordController,
};
