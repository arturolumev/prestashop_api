const express = require("express");
const axios = require("axios");

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
          limit: 3,
        },
        headers: {
          Authorization: "ZBR3Q8MEZ3KC16C7Z5CMYYD9V1VFCT3T",
        },
      }
    );

    // Extraer la información específica de cada producto
    const productsInfo = response.data.products.map((product) => {
      return {
        name: product.name[0].value, // Si el nombre está disponible en el idioma predeterminado
        reference: product.reference,
        price: product.price,
      };
    });

    // Mostrar la información por consola
    productsInfo.forEach((product) => {
      console.log(
        `Nombre: ${product.name}, Referencia: ${product.reference}, Precio: ${product.price}`
      );
      console.log("---");
    });

    res.json(response.data);
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
        TipoIdentidadId: "buscar en otra tabla",
        NroIdentidad: "Sacar de la tabla address",
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
        Telefonos: "sacar de la tabla address", 
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

    res.json(customersInfo);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al obtener los clientes de PrestaShop" });
  }
});

// Endpoint para obtener las órdenes desde PrestaShop


// Endpoint para obtener las órdenes desde PrestaShop
app.get("/api/orders", async (req, res) => {
  try {
    const response = await axios.get(
      "https://ZBR3Q8MEZ3KC16C7Z5CMYYD9V1VFCT3T@www.kukyflor.com/api/orders",
      {
        params: {
          display:
            "all",
          output_format: "XML",
          limit: 5,
        },
        headers: {
          Authorization: "ZBR3Q8MEZ3KC16C7Z5CMYYD9V1VFCT3T",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al obtener los pedidos de PrestaShop" });
  }
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
