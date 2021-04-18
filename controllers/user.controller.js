const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const mongoose = require("mongoose");
// TODO: req.user가 어떤식으로 들어오는지 확인 필요

const User = require("../models/User");

async function postLogin(req, res, next) {
  // NOTE data 어떻게 받을지, 그리고 이름 필드 필요.(닉네임 뿐 아니라)
  const { email, name } = req.body;

  try {
    // TODO: await 필요한가
    await User.findOrCreate({ email }, { name }, (err, user) => {
      if (err) {
        next(createError(500, "Internal server error."));
        return;
      }

      const accessToken = jwt.sign({
        id: user._id,
      }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "3h" });

      res.cookie("authorization", `bearer ${accessToken}`);
      res.json({ ok: true, data: user });
    });
  } catch (err) {
    next(err);
  }
}

async function getUserByToken(req, res, next) {
  const { authorization } = req.cookies;

  // NOTE: deserialize에서 걸러준다면, 없어도 되는 케이스일 것 같다
  if (!authorization) {
    next(createError(401, "authorization is not exist."));
    return;
  }

  const token = authorization.split("bearer ")[1];

  try {
    const { id } = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(id)?.lean();

    if (!user) {
      next(createError(400, "user is not exist."));
      return;
    }

    res.json({ ok: true, data: user });
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      next(createError(401, "authorization is not correct."));
      return;
    }

    next(err);
  }
}

// NOTE: deserialize에서 req.user === null인 케이스를 걸렀다는 전제로 작성
async function deleteUser(req, res, next) {
  const { _id } = req.user;

  try {
    const user = await User.deleteOne({ _id });

    res.json({ ok: true, data: user });
  } catch (err) {
    next(err);
  }
}

async function getUserById(req, res, next) {
  const { id } = req.params;

  // NOTE: id의 형식이 _id인지를 확인해주는 부분인데, 현재 db의 data기준 오류남. 어디가 잘못된것이지?
  if (!(id instanceof mongoose.Types.ObjectId)) {
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
