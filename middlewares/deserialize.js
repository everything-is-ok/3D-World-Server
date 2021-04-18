const jwt = require("jsonwebtoken");

const User = require("../models/User");

async function deserialize(req, res, next) {
  const { authorization } = req.cookies;

  if (!authorization) {
    req.user = null;
    next();
    return;
  }

  const token = authorization.split("bearer ")[1];

  try {
    const { id } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(id)?.lean();

    if (!user) {
      req.user = null;
      next();
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      req.user = null;
      next();
      return;
    }

    next(err);
  }
}

module.exports = deserialize;
