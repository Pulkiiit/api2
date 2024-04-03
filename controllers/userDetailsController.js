const { queryDatabase } = require("../config/dbConnect");
const { checkPasswordStrength } = require("../controllers/registerController");
const { cloudinary } = require("../config/cloudinary");
const getUserDetails = async (req, res) => {
  try {
    const { verifiedEmail } = req.body;
    const data = await queryDatabase("SELECT * FROM users WHERE email = $1", [
      verifiedEmail,
    ]);
    return res.status(200).json(data[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const updateUserDetails = async (req, res) => {
  try {
    const { verifiedEmail, username, email, password } = req.body;
    const { image } = req.file;
    // no input check
    if (!username && !email && !password && !image) {
      return res
        .status(400)
        .json({ message: "Please provide atleast one input field to update" });
    }

    const user = await queryDatabase("SELECT * FROM users WHERE email = $1", [
      verifiedEmail,
    ]);
    const userData = user[0];
    //handle image upload and delete old image
    if (image) {
      userData.image = secure_url;
      const publicId = cloudinary.utils.extractPublicId(user[0].image);
      await cloudinary.uploader.destroy(publicId);
      var { secure_url } = await cloudinary.uploader.upload(image.path);
    }
    //update infomration
    if (username) userData.username = username;
    // email uniqueness check
    if (email) {
      const exisitngUser = await queryDatabase(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );
      if (exisitngUser.length > 0) {
        return res
          .status(400)
          .json({ error: "User with this email already exists." });
      }
      userData.email = email;
    }
    // password strength check
    if (password) {
      if (
        checkPasswordStrength(password) !== "Password strength is sufficient"
      ) {
        return res.status(400).json({
          message: checkPasswordStrength(password),
        });
      }
      userData.password = password;
    }
    await queryDatabase(
      "UPDATE users SET username = $1, email = $2, password = $3, image = $4 WHERE email = $5",
      [
        userData.username,
        userData.email,
        userData.password,
        userData.image,
        verifiedEmail,
      ]
    );
    return res.status(200).json({ message: "Successfull" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getUserDetails, updateUserDetails };
