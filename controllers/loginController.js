const bcrypt = require("bcrypt");
const { jwt } = require("jsonwebtoken");
const { queryDatabase } = require("../config/dbConnect");
const loginController = async (req, res) => {
  try {
    // required arguments check
    const requiredArguments = ["username", "password"];

    const missingArguments = requiredArguments.filter(
      arg => !(arg in req.body) || !req.body[arg]
    );

    if (missingArguments.length > 0) {
      return res.status(400).json({
        message: `Missing required arguments: ${missingArguments.join(", ")}`,
      });
    }

    const { email, password } = req.body;

    // cehck if user exists
    const user = await queryDatabase("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (!(user.length > 0)) {
      return res.status(401).json({ error: "No use user exists" });
    }
    //password check
    const match = await bcrypt.compare(password, user[0].password);
    if (!match) {
      return res.status(401).json({ error: "Incorrect password" });
    }
    const token = jwt.sign(
      { email: user[0].email, role: user[0].role },
      process.env.JWT_SECRET,
      {
        expiresIn: "3h",
      }
    );
    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { loginController };
