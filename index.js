const express = require("express");
const axios = require("axios");
const xml2js = require("xml2js");
const parser = new xml2js.Parser({ explicitArray: false });

const app = express();
const port = 3099;

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
          limit: 10,
        },
        headers: {
          Authorization: "ZBR3Q8MEZ3KC16C7Z5CMYYD9V1VFCT3T",
        },
      }
    );

    // Extraer la información específica de cada producto
    const productsInfo = response.data.products.map((product) => {
      return {
        //EmpresaId: product.name[0].value,
        //ProductoId: product.reference,
        Descripcion: product.meta_title[0].value,
        Abreviatura: product.reference,
        //GrupoId: "no tiene una categoria especificada", 
        
        // id: 050101 es PRESTASHOP 
        // guardar por nombre no por id
        
        //UMUnitarioId: "no tiene",
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
