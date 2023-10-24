const request = require("supertest");
const app = require("../src/app");
const { Usuario } = require("../src/db");

// Prueba para el controlador updateUserByEmailController
describe("updateUserController", () => {
  it("should update a user by idusuario", async () => {
    const response = await request(app)
      .put("/user/1")
      .send({ nombre: "Dante" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Usuario modificado");
  });

  it("should handle user not found", async () => {
    const response = await request(app)
      .put("/user/35")
      .send({ nombre: "Otro" });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Usuario no encontrado");
  });
});
describe("createUserController", () => {
  it("should create a new user", async () => {
    // Datos de prueba
    const newUser = {
      nombre: "Otro",
      userName: "Otro33",
      apellido: "Aviani",
      password: "maria",
    };

    const response = await request(app).post("/user").send(newUser);

    expect(response.status).toBe(201);

    expect(response.body.message).toBe("Usuario creado");
    expect(response.body).toHaveProperty("newUser");

    const createdUser = await Usuario.findByPk(response.body.newUser.idUsuario);
    expect(createdUser).not.toBeNull();
  });

  it("should handle validation error for missing fields", async () => {
    // Datos de prueba con campos faltantes
    const invalidUserData = {
      nombre: "María",
      userName: "María22",
      apellido: "Aviani",
    };

    const response = await request(app).post("/user").send(invalidUserData);

    expect(response.status).toBe(400);

    expect(response.body).toHaveProperty(
      "message",
      "Debe proporcionar todos los campos requeridos."
    );
  });
});
