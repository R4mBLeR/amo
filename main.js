const express = require("express");
const axios = require("axios");
require("dotenv").config();
const app = express();
const PORT = 3091;
app.use(express.urlencoded({ extended: true }));
app.get("/send_message", async (req, res) => {
  const leadId = req.body.leads.add[0].id;
  const amoDomain = process.env.AMO_DOMAIN;
  //const leadId = 43537739;
  const amoToken = process.env.AMO_TOKEN;
  const headers = {
    Authorization: `Bearer ${amoToken}`,
    "Content-Type": "application/json",
  };
  console.log(leadId);
  try {
    let response = await axios.get(
      `https://${amoDomain}/api/v4/leads/${leadId}`,
      {
        headers: {
          Authorization: `Bearer ${amoToken}`,
          "Content-Type": "application/json",
        },
        params: {
          with: "catalog_elements",
        },
      },
    );
    console.log(response.data);
    const elements = response.data._embedded.catalog_elements;
    const element = elements.at(-1);
    const elementId = element.id;
    const catalogId = element.metadata.catalog_id;

    response = await axios.get(
      `https://${amoDomain}/api/v4/catalogs/${catalogId}/elements/${elementId}`,
      {
        headers: {
          Authorization: `Bearer ${amoToken}`,
          "Content-Type": "application/json",
        },
        params: {
          with: "catalog_elements",
        },
      },
    );
    const fields = response.data.custom_fields_values;
    const billField = fields.find((item) => item.field_code === "BILL_PRICE");
    const price = billField.values[0].value;

    const data = [
      {
        note_type: "common",
        text: `Выставлен новый счет на сумму: ${price} руб.`,
      },
    ];

    const noteResponse = await axios.post(
      `https://${amoDomain}/api/v4/leads/${leadId}/notes`,
      data,
      { headers },
    );
    console.log("Сообщение отправлено");
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401) {
        console.log(error.response);
        console.log("Неверный токен");
      }
    }
  }
  res.status(200).send("OK");
});

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});
