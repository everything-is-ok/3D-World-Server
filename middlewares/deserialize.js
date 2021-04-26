const jwt = require("jsonwebtoken");

const User = require("../models/User");

// TODO: authenticate middleware를 만들 것인가? deserialize에 포함시킬 것인가?
async function deserialize(req, res, next) {
  const { authorization } = req.cookies;

  if (!authorization) {
    req.user = null;
    next();
    return;
  }

  const token = authorization.split("bearer ")[1];

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User
      .findById(decodedToken.id)
      ?.populate("friends")
      .lean();

    const isExpiredInOneHour = decodedToken.exp - Date.now() < 60 * 60 * 1000;

    if (isExpiredInOneHour) {
      const accessToken = jwt.sign({
        id: decodedToken.id,
      }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "3h" });

      res.cookie("authorization", `bearer ${accessToken}`);
    }

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
