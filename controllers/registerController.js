const bcrypt = require("bcrypt");
const { queryDatabase } = require("../config/dbConnect");
const { cloudinary } = require("../config/cloudinary");
const { sendEmail } = require("../helper/sendEmail");

const checkPasswordStrength = password => {
  // ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$
  // regex for same as above
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
  //missing arguments check

  try {
    const { username, email, password } = req.body;
    const { image } = req.file;

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

    //password strength check

    const passwordStrength = checkPasswordStrength(password);

    if (passwordStrength !== "Password strength is sufficient") {
      return res.status(400).json({
        error: passwordStrength,
      });
    }

    //creating user also hashing password

    const hashedPassword = await bcrypt.hash(password, 10);
    if (image) {
      const { secure_url } = await cloudinary.uploader.upload(image.path);
      await queryDatabase(
        `INSERT INTO users (username, password, email, image) VALUES ($1,$2,$3,$4)`,
        [username, hashedPassword, email, secure_url]
      );
      return res.status(200).json({ message: "User created successfully" });
    } else {
      await queryDatabase(
        `INSERT INTO users (username, password, email) VALUES ($1,$2,$3)`,
        [username, hashedPassword, email]
      );
      await sendEmail("register", email, {});
      return res.status(200).json({ message: "User created successfully" });
    }
  } catch (err) {
    console.error(err);

    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { registerController, checkPasswordStrength };
