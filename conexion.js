const http = require("http");
const sql = require("mssql");

// Configuración de la conexión a la base de datos
const config = {
  user: "kuky",
  password: "Kf123456",
  server: "3.144.237.208",
  database: "prueba_kflor",
  options: {
    encrypt: false, // Si estás utilizando Azure, establece esto en true
  },
};
// Función para obtener los datos de la tabla y convertirlos en JSON
async function obtenerDatosComoJSON() {
  try {
    // Conectar a la base de datos
    await sql.connect(config);

    // Consulta para seleccionar los datos de la tabla
    const result = await sql.query("SELECT * FROM personeria");

    // Convertir el resultado en formato JSON
    const jsonData = result.recordset;

    // Cerrar la conexión
    await sql.close();

    return jsonData;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function obtenerProdComoJSON() {
  try {
    // Conectar a la base de datos
    await sql.connect(config);

    // Consulta para seleccionar los datos de la tabla
    const result = await sql.query("SELECT * FROM producto");

    // Convertir el resultado en formato JSON
    const jsonData = result.recordset;

    // Cerrar la conexión
    await sql.close();

    return jsonData;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function obtenerPedidoCabeceraComoJSON() {
  try {
    // Conectar a la base de datos
    await sql.connect(config);

    // Consulta para seleccionar los datos de la tabla
    const result = await sql.query("SELECT * FROM VentaPedidoCabecera");

    // Convertir el resultado en formato JSON
    const jsonData = result.recordset;

    // Cerrar la conexión
    await sql.close();

    return jsonData;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function obtenerProductosPrestashopComoJSON() {
  try {
    // Conectar a la base de datos
    await sql.connect(config);

    // Consulta para seleccionar los datos de la tabla
    const result = await sql.query("SELECT * FROM producto WHERE GrupoId = 050101");

    // Convertir el resultado en formato JSON
    const jsonData = result.recordset;

    // Cerrar la conexión
    await sql.close();

    return jsonData;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Crear el servidor HTTP
const server = http.createServer(async (req, res) => {
  // Verificar si la solicitud es para obtener los datos
  if (req.url === "/personeria") {
    try {
      // Obtener los datos de la base de datos como JSON
      const jsonData = await obtenerDatosComoJSON();

      // Configurar la cabecera de respuesta para indicar que se está devolviendo JSON
      res.writeHead(200, { "Content-Type": "application/json" });

      // Enviar los datos como respuesta al navegador
      res.end(JSON.stringify(jsonData));
    } catch (error) {
      // Enviar un mensaje de error si ocurrió un problema al obtener los datos
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Error al obtener los datos de la base de datos");
    }
  } else if (req.url === "/productos") {
    try {
      // Obtener los datos de la base de datos como JSON
      const jsonData = await obtenerProdComoJSON();

      // Configurar la cabecera de respuesta para indicar que se está devolviendo JSON
      res.writeHead(200, { "Content-Type": "application/json" });

      // Enviar los datos como respuesta al navegador
      res.end(JSON.stringify(jsonData));
    } catch (error) {
      // Enviar un mensaje de error si ocurrió un problema al obtener los datos
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Error al obtener los datos de la base de datos");
    }
  } else if (req.url === "/pedidocabecera") {
    try {
      // Obtener los datos de la base de datos como JSON
      const jsonData = await obtenerPedidoCabeceraComoJSON();

      // Configurar la cabecera de respuesta para indicar que se está devolviendo JSON
      res.writeHead(200, { "Content-Type": "application/json" });

      // Enviar los datos como respuesta al navegador
      res.end(JSON.stringify(jsonData));
    } catch (error) {
      // Enviar un mensaje de error si ocurrió un problema al obtener los datos
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Error al obtener los datos de la base de datos");
    }
  } else if (req.url === "/productoPS") {
    try {
      // Obtener los datos de la base de datos como JSON
      const jsonData = await obtenerProductosPrestashopComoJSON();

      // Configurar la cabecera de respuesta para indicar que se está devolviendo JSON
      res.writeHead(200, { "Content-Type": "application/json" });

      // Enviar los datos como respuesta al navegador
      res.end(JSON.stringify(jsonData));
    } catch (error) {
      // Enviar un mensaje de error si ocurrió un problema al obtener los datos
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Error al obtener los datos de la base de datos");
    }
  } else {
    // Si la solicitud no es para obtener datos, devolver un mensaje de error
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Ruta no encontrada");
  }
});

// Escuchar en el puerto 3000
const PORT = 3005;
server.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
