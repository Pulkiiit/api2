const express = require("express");
require("dotenv").config();
const { registerController } = require("./controllers/registerController");
const { loginController } = require("./controllers/loginController");
const { verifyToken } = require("./middlewares/tokenMiddleware");
const { verifyAdminToken } = require("./middlewares/verifyAdminToken");
const { argumentCheck } = require("./middlewares/argumentCheck");
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
app.post(
  "/register",
  argumentCheck(["username", "email", "password"]),
  registerController
);

app.post("/login", argumentCheck(["email", "password"]), loginController);

app.use("/user", verifyToken, require("./routes/user"));

app.use("admin", verifyAdminToken, require("./routes/admin"));

app.use("/course", require("./routes/course"));
