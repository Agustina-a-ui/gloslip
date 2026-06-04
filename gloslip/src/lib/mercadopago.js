import MercadoPago from "mercadopago";

const client = new MercadoPago({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

export default client;