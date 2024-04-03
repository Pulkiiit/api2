const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  if (token === process.env.ADMIN_TOKEN) {
    next();
  } else {
    return res.status(403).json({ error: "Invalid token" });
  }
};

module.exports = { verifyAdminToken };
