const argumentCheck = requiredArguments => (req, res, next) => {
  const missingArguments = requiredArguments.filter(
    arg => !(arg in req.body) || !req.body[arg]
  );
  if (missingArguments.length > 0) {
    return res.status(400).json({
      message: `Missing required arguments: ${missingArguments.join(", ")}`,
    });
  }
  next();
};

module.exports = { argumentCheck };
