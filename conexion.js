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
    const result = await sql.query(
      "SELECT * FROM producto ORDER BY ProductoID DESC"
    );

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

async function insertarProductoSiNoExiste(producto) {
  try {
    // Conectar a la base de datos
    await sql.connect(config);

    // Verificar si el producto ya existe en la base de datos por su código alterno
    const existeProducto = await sql.query(
      `SELECT COUNT(*) AS count FROM producto WHERE CodigoAlterno = '${producto.CodigoAlterno}'`
    );

    // Si existe el producto, mostrar un mensaje y continuar
    if (existeProducto.recordset[0].count > 0) {
      console.log(
        `El producto con código alterno ${producto.CodigoAlterno} ya existe en la base de datos. Continuando con el siguiente.`
      );
      return;
    }

    // Si no existe el producto, insertarlo en la base de datos
    const result = await sql.query(
      `INSERT INTO producto (EmpresaID, Descripcion, Abreviatura, GrupoID, UMUnitarioID, StockMaximo, StockMinimo, MarcaID, Modelo, Peso, Ubicacion, Area, CodigoBarra, CodigoAlterno, Estado, UsuarioID, FechaCreacion, FechaModificacion, Idodoo, Precio, Habilitado) 
       VALUES (${producto.EmpresaId}, '${producto.Descripcion}', '${producto.Abreviatura}', '${producto.GrupoId}', ${producto.UMUnitarioId}, ${producto.StockMaximo}, ${producto.StocMinimo}, ${producto.MarcaId}, '${producto.Modelo}', ${producto.Peso}, '${producto.Ubicacion}', ${producto.Area}, '${producto.CodigoBarra}', '${producto.CodigoAlterno}', '${producto.Estado}', ${producto.UsuarioID}, '${producto.FechaCreacion}', '${producto.FechaModificacion}', ${producto.Idodoo}, ${producto.Precio}, ${producto.Habilitado})`
    );

    console.log(
      `Producto con código alterno ${producto.CodigoAlterno} insertado correctamente.`
    );
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    // Cerrar la conexión
    await sql.close();
  }
}

async function obtenerProdGrupoComoJSON() {
  try {
    // Conectar a la base de datos
    await sql.connect(config);

    // Consulta para seleccionar los datos de la tabla
    const result = await sql.query("SELECT * FROM productogrupo");

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
  } else if (req.url === "/productogrupo") {
    try {
      // Obtener los datos de la base de datos como JSON
      const jsonData = await obtenerProdGrupoComoJSON();

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
  } else {
    // Si la solicitud no es para obtener datos, devolver un mensaje de error
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Ruta no encontrada");
  }
});

// Escuchar en el puerto 3000
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
