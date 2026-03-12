require("dotenv").config();
const express = require("express");
const cors = require("cors");
const productsRoutes = require("./routes/products.routes");
const clientsRoutes = require("./routes/clients.routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/products", productsRoutes);
app.use("/api/clients", clientsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
