const bcrypt = require("bcrypt");
const { queryDatabase } = require("../config/dbConnect");

const checkPasswordStrength = password => {
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }

  // Check if password contains at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }

  // Check if password contains at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }

  // Check if password contains at least one digit
  if (!/\d/.test(password)) {
    return "Password must contain at least one digit";
  }

  // Check if password contains at least one special character
  if (!/[^A-Za-z0-9]/.test(password)) {
    return "Password must contain at least one special character";
  }

  // Password meets all criteria
  return "Password strength is sufficient";
};

const registerController = async (req, res) => {
  //missing arguments validation
  try {
    const requiredArguments = ["username", "password", "email"];
    const missingArguments = requiredArguments.filter(
      arg => !(arg in req.body)
    );
    if (missingArguments.length > 0) {
      return res.status(400).json({
        message: `Missing required arguments: ${missingArguments.join(", ")}`,
      });
    }

    const { username, email, password } = req.body;

    //email uniqueness check
    const exisitngUser = await queryDatabase(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (exisitngUser.length > 0) {
      return res
        .status(400)
        .json({ error: "User with this email already exists." });
    }

    //password stringth check
    const passwordStrength = checkPasswordStrength(password);
    if (passwordStrength !== "Password strength is sufficient") {
      return res.status(400).json({
        error: passwordStrength,
      });
    }

    //creating user
    const newUser = await queryDatabase(
      `INSERT INTO users (username, password, email) VALUES ($1,$2,$3)`,
      [username, password, email]
    );
    if (newUser.rowCount === 1) {
      return res.status(200).json({ message: "User created successfully" });
    } else {
      return res.status(400).json({ err: "Failed to create user" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { registerController };
