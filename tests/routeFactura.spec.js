const request = require("supertest");
const app = require("../src/app");
const { Factura } = require("../src/db");

describe("Factura Controllers", () => {
  describe("getFacturasController", () => {
    it("should get all invoices", async () => {
      await Factura.bulkCreate([
        { cliente: "Cliente 1", total: 100, fecha: "2023-10-25", usuarioIdUsuario: 1 },
        { cliente: "Cliente 2", total: 150, fecha: "2023-10-26", usuarioIdUsuario: 2 },
      ]);
      const response = await request(app).get("/factura");

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(12);
    });

    it("should handle no invoices found", async () => {
      const response = await request(app).get("/factura");

      expect(response.status).toBe(404);
      expect(response.text).toBe("No se encontraron facturas en la base de datos");
    });
  });

  describe("createFacturasController", () => {
    it("should create a new invoice", async () => {

      // Datos de factura de prueba
      const newBill = {
        cliente: "Nuevo Cliente",
        total: 200,
        fecha: "2023-10-27",
        usuarioIdUsuario: 3,
      };

      const response = await request(app).post("/factura").send(newBill);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Factura subida correctamente");
      expect(response.body).toHaveProperty("newBill");

      const createdInvoice = await Factura.findByPk(response.body.newBill.idFactura);
      expect(createdInvoice).not.toBeNull();
    });

    it("should handle missing fields", async () => {
      const invalidInvoice = {
        cliente: "Nuevo Cliente",
        total: 200,
      };

      const response = await request(app).post("/factura").send(invalidInvoice);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Debe proporcionar todos los campos obligatorios");
    });

    it("should handle non-existing user", async () => {
      // Intentar crear una factura con un usuario que no existe en la base de datos
      const invalidInvoice = {
        cliente: "Nuevo Cliente",
        total: 200,
        fecha: "2023-10-27",
        usuarioIdUsuario: 999,
      };

      const response = await request(app).post("/factura").send(invalidInvoice);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("El usuario no existe");
    });
  });
});
