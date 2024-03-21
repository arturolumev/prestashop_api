const express = require("express");
const axios = require("axios");
const xml2js = require("xml2js");
const parser = new xml2js.Parser({ explicitArray: false });

const app = express();
const port = 3099;

////////////////////////////////
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
      `INSERT INTO producto (EmpresaID, Descripcion, Abreviatura, Codigo, GrupoID, UMUnitarioID, StockMaximo, StockMinimo, MarcaID, Modelo, Peso, Ubicacion, Area, CodigoBarra, CodigoAlterno, Estado, UsuarioID, FechaCreacion, FechaModificacion, Idodoo, Precio, Habilitado) 
       VALUES (${producto.EmpresaId}, '${producto.Descripcion}', '${producto.Abreviatura}', '${producto.Codigo}', '${producto.GrupoId}', ${producto.UMUnitarioId}, ${producto.StockMaximo}, ${producto.StocMinimo}, ${producto.MarcaId}, '${producto.Modelo}', ${producto.Peso}, '${producto.Ubicacion}', ${producto.Area}, '${producto.CodigoBarra}', '${producto.CodigoAlterno}', '${producto.Estado}', ${producto.UsuarioID}, '${producto.FechaCreacion}', '${producto.FechaModificacion}', ${producto.Idodoo}, ${producto.Precio}, ${producto.Habilitado})`
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
//----------------------------------------------------------------
// Endpoint para obtener productos desde PrestaShop
// Endpoint para obtener los primeros 10 productos desde PrestaShop
app.get("/api/products", async (req, res) => {
  try {
    const response = await axios.get(
      "https://ZBR3Q8MEZ3KC16C7Z5CMYYD9V1VFCT3T@www.kukyflor.com/api/products",
      {
        params: {
          display: "full",
          output_format: "JSON",
          // limit: 10,
        },
        headers: {
          Authorization: "ZBR3Q8MEZ3KC16C7Z5CMYYD9V1VFCT3T",
        },
      }
    );

    // Extraer la información específica de cada producto
    const productsInfo = response.data.products.map((product) => {
      return {
        EmpresaId: 1,
        //ProductoId: product.reference,
        Descripcion: product.meta_title[0].value,
        Abreviatura: product.reference,
        Codigo: "",
        GrupoId: "050101",

        // id: 050101 es PRESTASHOP
        // guardar por nombre no por id

        UMUnitarioId: 138.00015,
        StockMaximo: 0,
        StocMinimo: 0,
        MarcaId: 124,
        Modelo: "",
        Peso: 0,
        Ubicacion: "",
        Area: 0,
        CodigoBarra: "",
        CodigoAlterno: product.reference,
        Estado: "1",
        UsuarioID: 1,
        FechaCreacion: product.date_add,
        FechaModificacion: product.date_upd,
        Idodoo: null,
        Precio: 0,
        Habilitado: 1,
      };
    });

    // // Insertar cada producto si no existe en la base de datos
    // for (const producto of productsInfo) {
    //   await insertarProductoSiNoExiste(producto);
    // }

    res.json(productsInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al obtener los primeros 10 productos de PrestaShop",
    });
  }
});

// Endpoint para obtener los clientes desde PrestaShop
app.get("/api/customers", async (req, res) => {
  try {
    const response = await axios.get(
      "https://ZBR3Q8MEZ3KC16C7Z5CMYYD9V1VFCT3T@www.kukyflor.com/api/customers",
      {
        params: {
          display: "full",
          output_format: "JSON",
          limit: 3,
        },
        headers: {
          Authorization: "ZBR3Q8MEZ3KC16C7Z5CMYYD9V1VFCT3T",
        },
      }
    );

    // Extraer la información específica de cada cliente
    const customersInfo = response.data.customers.map((customer) => {
      return {
        //TipoIdentidadId: "buscar en otra tabla",
        //NroIdentidad: "Sacar de la tabla address",
        GrupoPersoneria: 1,
        Personeria: `${customer.name ? customer.name : ""}`,
        NombreComercial: `${customer.name ? customer.name : ""}`,
        Domiciliado: 1,
        TipoContribuyente: "1",
        FamiliaID: 143,
        NegocioID: 179,
        CtaDetraccion: "",
        Codigo: "",
        Estado: 1,
        UsuarioID: "1",
        FechaCreacion: `${customer.date_add ? customer.date_add : ""}`,
        FechaModificacion: `${customer.date_upd ? customer.date_add : ""}`,
        ConvenioID: 902.00001,
        MedioRegistroID: 900.00001,
        MedioInformacionID: 901.00001,
        Referencia: "",
        //Telefonos: "sacar de la tabla address",
        email: `${customer.email ? customer.email : ""}`,
      };
    });

    // Mostrar la información por consola
    customersInfo.forEach((customer) => {
      console.log(
        `
        TipoIdentidadId: *buscar en otra tabla*,
        NroIdentidad: *Sacar de la tabla address*,
        GrupoPersoneria: 1,
        Personeria: ${customer.name ? customer.name : ""}, 
        NombreComercial: ${customer.name ? customer.name : ""}, 
        Domiciliado: 1, 
        TipoContribuyente: "1", 
        FamiliaID: 143, 
        NegocioID: 179, 
        CtaDetraccion: "", 
        Codigo: "", 
        Estado: 1, 
        UsuarioID: "1", 
        FechaCreacion: ${customer.date_add ? customer.date_add : ""}, 
        FechaModificacion: ${customer.date_upd ? customer.date_add : ""}, 
        ConvenioID: 902.00001, 
        MedioRegistroID: 900.00001, 
        MedioInformacionID: 901.00001, 
        Referencia: "", 
        Telefonos: *sacar de la tabla address*, 
        email: ${customer.email ? customer.email : ""}, 
        `
      );
      console.log("---");
    });

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al obtener los clientes de PrestaShop" });
  }
});

app.get("/api/orders", async (req, res) => {
  try {
    const page = req.query.page || 1; // Obtener el número de página de la consulta
    const pageSize = req.query.pageSize || 10; // Obtener el tamaño de la página de la consulta

    const response = await axios.get(
      "https://ZBR3Q8MEZ3KC16C7Z5CMYYD9V1VFCT3T@www.kukyflor.com/api/orders",
      {
        params: {
          display: "full",
          output_format: "XML",
          page: page,
          limit: pageSize,
        },
        headers: {
          Authorization: "ZBR3Q8MEZ3KC16C7Z5CMYYD9V1VFCT3T",
        },
      }
    );

    // Parsear la respuesta XML
    parser.parseString(response.data, (err, result) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: "Error al parsear la respuesta XML" });
      }

      // Extraer los elementos <order>
      const orders = result.prestashop.orders.order;

      // Extraer la información específica de cada cliente
      const ordersInfo = result.prestashop.orders.order.map((order) => {
        return {
          PersoneriaID: order.id_customer,
          OficinaAlmacenID: 1,
          DireccionID: 1, //en la db hay 1 y 2
          MonedaID: "102.00001",
          ListaPrecioID: "108.00001",
          estado: order.current_state,
          ContadoEstado: 0,
          VendedorId: "1",
          TipoEntrega: 2,
          FechaEntrega: order.delivery_date,
          DireccionEntrega: order.id_address_delivery,
          OficinaAlmacenEntregaID: "1",
          referencia: order.reference,
          Observaciones: "",
          cliente: "",
          Contacto: "",
          ContactoTelefono: "",
          tipoventa: 0,
          HabilitarFecha: "0",
          MotivoID: "190.00062", //por defecto
          CondicionVtaID: "113.00001", //por defecto
          DeliveryTipoID: "193.00001", //por defecto
          DeliveryTurnoID: "192.00002", //por defecto
          TipoDocID: "", // se jalara por address
          ValorPedido: order.total_paid,
          PrecioPedido: order.total_paid,
          FacturarSwitch: 0,
          ConvenioID: "902.00002", //por defecto
          firstname: order.firstname,
          lastname: order.lastname,
          addres1: order.addres1,
          addres2: order.addres2,
          id_state: order.id_state,
          phone: order.phone,
          dniORUC: order.company,
        };
      });

      res.json(orders);
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al obtener los pedidos de PrestaShop" });
  }
});

app.get("/api/orders/:id", async (req, res) => {
  const orderId = req.params.id;

  try {
    const response = await axios.get(
      "https://ZBR3Q8MEZ3KC16C7Z5CMYYD9V1VFCT3T@www.kukyflor.com/api/orders/${orderId}",
      {
        params: {
          output_format: "XML",
        },
        headers: {
          Authorization: "ZBR3Q8MEZ3KC16C7Z5CMYYD9V1VFCT3T",
        },
      }
    );

    // Parsear la respuesta XML
    parser.parseString(response.data, (err, result) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ error: "Error al parsear la respuesta XML" });
      }

      // Extraer la orden con el ID especificado
      const order = result.prestashop.order;

      res.json(order);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener la orden de PrestaShop" });
  }
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
