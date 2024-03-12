const express = require("express");
const axios = require("axios");

const app = express();
const port = 3099;

// Endpoint para obtener productos desde PrestaShop
// Endpoint para obtener los primeros 10 productos desde PrestaShop
app.get("/api/products", async (req, res) => {
  try {
    const response = await axios.get(
      "https://ZBR3Q8MEZ3KC16C7Z5CMYYD9V1VFCT3T@www.kukyflor.com/api/products?output_format=JSON",
      {
        params: {
          display: "name,reference,price",
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
      "https://ZBR3Q8MEZ3KC16C7Z5CMYYD9V1VFCT3T@www.kukyflor.com/api/customers?output_format=JSON",
      {
        params: {
          display: "firstname,lastname,dni,address",
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
        name: `${customer.firstname} ${customer.lastname}`,
        dni: customer.dni,
        address: customer.address, // Asegúrate de que el campo de dirección sea correcto según tu estructura de datos
      };
    });

    // Mostrar la información por consola
    customersInfo.forEach((customer) => {
      console.log(
        `Nombre: ${customer.name}, DNI: ${customer.dni}, Dirección: ${customer.address}`
      );
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
app.get("/api/orders", async (req, res) => {
  try {
    const response = await axios.get(
      "https://ZBR3Q8MEZ3KC16C7Z5CMYYD9V1VFCT3T@www.kukyflor.com/api/orders?output_format=JSON",
      {
        params: {
          display:
            "date_add,id_customer,total_paid_real,invoice_number,order_rows",
          output_format: "JSON",
          limit: 3,
        },
        headers: {
          Authorization: "ZBR3Q8MEZ3KC16C7Z5CMYYD9V1VFCT3T",
        },
      }
    );

    // Extraer la información específica de cada orden
    const ordersInfo = response.data.orders.map((order) => {
      const montoTotal = order.associations.order_rows.reduce(
        (total, orderRow) => {
          return (
            total + orderRow.product_quantity * orderRow.unit_price_tax_incl
          );
        },
        0
      );

      return {
        fecha_pedido: order.date_add,
        cliente: order.id_customer,
        monto_total: montoTotal,
        factura_boleta: order.invoice_number ? "Factura" : "Boleta",
        detalle_pedido: order.associations.order_rows.map((orderRow) => {
          return {
            producto: orderRow.product_name,
            cantidad: orderRow.product_quantity,
            precio: orderRow.unit_price_tax_incl,
          };
        }),
      };
    });

    // Mostrar la información por consola
    ordersInfo.forEach((order) => {
      console.log(`Fecha del pedido: ${order.fecha_pedido}`);
      console.log(`Cliente: ${order.cliente}`);
      console.log(`Monto total: ${order.monto_total}`);
      console.log(`Tipo de documento: ${order.factura_boleta}`);
      console.log("Detalle del pedido:");
      order.detalle_pedido.forEach((item) => {
        console.log(
          `  Producto: ${item.producto}, Cantidad: ${item.cantidad}, Precio: ${item.precio}`
        );
      });
      console.log("---");
    });

    // Enviar la respuesta al cliente
    res.json(ordersInfo);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al obtener las órdenes de PrestaShop" });
  }
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
