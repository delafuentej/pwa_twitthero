require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const path = require("path");

const app = express();

const publicPath = path.resolve(__dirname, "../public");
const port = process.env.PORT || 3000;
console.log(port);


app.use(bodyParser.json({limit: '10mb'})); // support json encoded bodies
app.use(bodyParser.urlencoded({limit:'10mb', extended: true })); // support encoded bodies

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

//
app.get('/api/google-map-key', (req, res) => {
  res.json({ key: process.env.GOOGLE_MAP_KEY }); // Reads the key of the .env file
});

app.listen(port, (err) => {
  if (err) throw new Error(err);

  console.log(`Servidor corriendo en puerto ${port}`);
});
