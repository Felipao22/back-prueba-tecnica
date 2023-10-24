El candidato realizara una aplicación donde pueda registrarse como
usuario, iniciar sesión y listar la facturas luego de iniciar sesión.
Desarrollando tanto el backend, como el frontend.
Backend
Desarrolle en Nodejs, utilizando express como framework una API REST
1. Cree un endpoint para crear el usuario
2. Cree un endpoint para actualizar un usuario. En la respuesta
incluya todo lo que le parezca pertinente.
2. Cree un endpoint para recuperar la informacion del cliente.
4. Crear un endpoint para realizar el log-in.
5. Cree una tabla, factura con los siguientes campos idFactura,
cliente, total , fecha . Llene aleatoriamente unos 10 registros
6. Cree un endpoint para recuperar las facturas.
Para todos los endpoint. Validar campos obligatorios, como son idUsuario
para GET, POST y PUT. Y como opcionales username, password,
usuario y nombre, para POST y PUT. Validar cualquier error que pueda
producirse con try catch y retornan el error y un estado HTTP 400.