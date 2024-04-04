const verifyAdminToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403); //invlaid token
      if (decoded.role !== "admin") {
        return res.sendStatus(401).json({ error: "Unauthorized" });
      }
      req.body.verifiedEmail = decoded.email;
      req.body.role = decoded.role;
      next();
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { verifyAdminToken };
