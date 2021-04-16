const jwt = require("jsonwebtoken");
// TODO: delete codes below, make new one

const User = require("../models/User");

function getUser(req, res) {
  res.status(200).json({
    data: {
      // data
    },
  });
}

async function postLogin(req, res, next) {
  const { userData } = req.body;

  // TODO: 유저데이터로 find-or-create시, 유저의 데이터 중 하나가 달라지면 찾는가 생성하는가 등의 문제 찾고 해결하기.
  try {
    // TODO: error 1. findOrCreate/ error2: jwt sign/ 분기처리?
    const { doc: user } = await User.findOrCreate(userData);

    const accessToken = jwt.sign({
      id: user._id,
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "3h" });

    res.cookie("authorization", `bearer ${accessToken}`);
    res.json({ data: user });
  } catch (error) {
    res.status(500).json({ error: { message: "Internal Server Error" } });
  }
}

exports.getUser = getUser;
exports.postLogin = postLogin;
