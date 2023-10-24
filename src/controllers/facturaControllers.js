const { Factura, Usuario } = require("../db");

async function getFacturasController(req, res) {
  try {
    const dbFacturas = await Factura.findAll();

    if (!dbFacturas || dbFacturas.length === 0) {
      return res
        .status(404)
        .send("No se encontraron facturas en la base de datos");
    }
    res.status(200).send(dbFacturas);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

async function createFacturasController(req, res) {
  const { cliente, total, fecha, usuarioIdUsuario } = req.body;

  try {
    if (!cliente || !total || !fecha || !usuarioIdUsuario) {
      return res
        .status(400)
        .json({ message: "Debe proporcionar todos los campos obligatorios" });
    }

    const existingUser = await Usuario.findOne({
      where: { idUsuario: usuarioIdUsuario },
    });

    if (!existingUser) {
      return res.status(404).json({ message: "El usuario no existe" });
    }

    const newBill = await Factura.create({
      cliente,
      total,
      fecha,
      usuarioIdUsuario,
    });

    res.status(200).json({ message: "Factura subida correctamente", newBill });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

module.exports = {
  getFacturasController,
  createFacturasController,
};
