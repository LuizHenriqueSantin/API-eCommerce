const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const clientRoutes = require("./routes/clientRoutes");
const productRoutes = require("./routes/productRoutes");

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());

app.use('/client', clientRoutes);
app.use('/product', productRoutes);

module.exports = app;