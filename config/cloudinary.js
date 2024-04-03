const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dweg2dkqj",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

module.exports = { cloudinary };
