const jwt = require("jsonwebtoken");

const db = require("../models");
const User = db.user;

const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) return res.status(403).send({ message: "No token provided" });

  jwt.verify(token, process.env.API_SECRET, async (err, decoded) => {
    if (err) return res.status(401).send({ message: "Unauthorized!" });

    const user = await User.findById(decoded.id);
    req.user = user;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.user.role != "Admin")
    return res.status(401).send({ message: "Unauthorized!" });

  next();
};

module.exports = { verifyToken, isAdmin };
