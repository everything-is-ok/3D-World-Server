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

    const populated = await user.populate("friends").execPopulate();

    res.cookie("authorization", `bearer ${accessToken}`);
    res.json({ ok: true, data: populated });
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

// TODO: req.body의 data validation 필요
async function updateUser(req, res, next) {
  const { _id } = req.user;
  const {
    name,
    description,
    photoURL,
    musicURL,
    friend,
  } = req.body;
  let newUser = {};

  if (!req.user) {
    next(createError(401, "authorization is invalid"));
    return;
  }

  // TODO: case별 error handling 필요한 경우 추가
  try {
    if (friend) {
      const addFriend = { $push: { friends: friend } };

      newUser = await User.findByIdAndUpdate(_id, addFriend, { new: true });
      const populatedUser = await newUser.populate("friends").execPopulate();

      res.json({ ok: true, data: populatedUser });
      return;
    }

    const updateInfo = {
      $set: {
        name,
        description,
        photoURL,
        musicURL,
      },
    };

    newUser = await User.findByIdAndUpdate(_id, updateInfo, { new: true });
    const populatedUser = await newUser.populate("friends").execPopulate();

    res.json({ ok: true, data: populatedUser });
  } catch (err) {
    next(err);
  }
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
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.getUserById = getUserById;
