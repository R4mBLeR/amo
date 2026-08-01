const express = require("express");
const app = express();
const PORT = 3091;
app.use(express.urlencoded({ extended: true }));
app.post("/send_message", (req, res) => {
  console.log(req.body.leads.add);
  //    const amoDomain = this.configService.get<string>('AMO_DOMAIN');
  //     const headers = {
  //       Authorization: `Bearer ${this.configService.get<string>('AMO_TOKEN')}`,
  //       'Content-Type': 'application/json',
  //     };
  //     const response = await axios.get(
  //       `https://${amoDomain}/api/v4/leads/${id}`,
  //       { headers },
  //     );
  //     if (response.status === 200 && response.data) {
  //       return { success: true, data: response.data };
  //     }
  res.status(200).send("OK");
});

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});
