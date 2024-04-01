const express = require("express");
require("dotenv").config();
const { registerController } = require("./controllers/registerController");

const app = express();

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//health check
app.get("/", (req, res) => {
  return res.send("ok");
});

//routes
app.post("/register", registerController);
