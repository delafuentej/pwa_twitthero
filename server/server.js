require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const path = require("path");

const app = express();

const publicPath = path.resolve(__dirname, "../public");
const port = process.env.PORT || 3000;
console.log(port);

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//Enable CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Proxy para FontAwesome
// app.use("/font-awesome", async (req, res) => {
//   const response = await fetch(`https://use.fontawesome.com${req.url}`);
//   const body = await response.text();
//   res.setHeader("Content-Type", "text/css");
//   res.send(body);
// });
// Directorio Público
app.use(express.static(publicPath));

// Rutas
const routes = require("./routes");
app.use("/api", routes);

app.listen(port, (err) => {
  if (err) throw new Error(err);

  console.log(`Servidor corriendo en puerto ${port}`);
});
