const jwt = require("jsonwebtoken");
const createError = require("http-errors");
// TODO: req.user가 어떤식으로 들어오는지 확인 필요

const User = require("../models/User");

async function getUser(req, res, next) {
  const { authorization } = req.cookie;

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

    res.json({ data: user });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(createError(401, "authorization is not correct."));
      return;
    }

    next(error);
  }
}

async function deleteUser(req, res, next) {
  const { _id } = req.user;

  try {
    const user = await User.deleteOne({ _id });

    if (!user) {
      next(createError(400, "Not Found User"));
      return;
    }

    res.json({ data: user });
  } catch (error) {
    next(error);
  }
}

async function postLogin(req, res, next) {
  const { userData } = req.body;

  // TODO: 유저데이터로 find-or-create시, 유저의 데이터 중 하나가 달라지면 찾는가 생성하는가 등의 문제 찾고 해결하기.
  const { doc: user } = await User.findOrCreate(userData);

  try {
    const accessToken = jwt.sign({
      id: user._id,
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "3h" });

    res.cookie("authorization", `bearer ${accessToken}`);
    res.json({ data: user });
  } catch (error) {
    // NOTE: next를 이용해서 error handling middleware에서 처리해야하는 것 아닌가요?
    res.status(500).json({ error: { message: "Internal Server Error" } });
  }
}

exports.getUser = getUser;
exports.deleteUser = deleteUser;
exports.postLogin = postLogin;
