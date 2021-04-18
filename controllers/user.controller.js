const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const mongoose = require("mongoose");
// TODO: req.user가 어떤식으로 들어오는지 확인 필요

const User = require("../models/User");

function postLogin(req, res, next) {
  const { email, name, photoURL } = req.body;

  User.findOrCreate({ email }, { name, photoURL }, async (err, user) => {
    if (err) {
      next(err);
      return;
    }

    const accessToken = jwt.sign({
      id: user._id,
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "3h" });

    res.cookie("authorization", `bearer ${accessToken}`);
    res.json({ ok: true, data: user });
  });
}

async function getUserByToken(req, res, next) {
  const { user } = req;

  if (!user) {
    next(createError(401, "user is not exist."));
    return;
  }

  res.json({ ok: true, data: user });
}

async function deleteUser(req, res, next) {
  const { user } = req;

  if (!user) {
    next(createError(401, "authorization is invalid."));
    return;
  }

  try {
    await User.deleteOne({ _id: user._id });

    res.json({ ok: true, data: user });
  } catch (err) {
    next(err);
  }
}

async function getUserById(req, res, next) {
  const { id } = req.params;

  if (!(mongoose.Types.ObjectId.isValid(id))) {
    next(createError(400, "id of param is invalid."));
    return;
  }

  try {
    const user = await User.findById(id)?.lean();

    if (!user) {
      // NOTE: 404 not found를 띄울지는 client에서 결정하는 것이므로, 서버에서는 id가 없다는 정보를 주면 될까?
      next(createError(400, "user is not exist."));
      return;
    }

    res.json({ ok: true, data: user });
  } catch (err) {
    next(err);
  }
}

exports.postLogin = postLogin;
exports.getUserByToken = getUserByToken;
exports.deleteUser = deleteUser;
exports.getUserById = getUserById;
