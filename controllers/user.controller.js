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
  // data 어떻게 받을지, 그리고 이름 필드 필요.(닉네임 뿐 아니라)
  const { email, name } = req.body;

  try {
    await User.findOrCreate({ email }, { name }, (error, user) => {
      if (error) {
        throw new Error();
      }

      const accessToken = jwt.sign({
        id: user._id,
      }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "3h" });

      res.cookie("authorization", `bearer ${accessToken}`);
      res.json({ data: user });
    });
  } catch (error) {
    // TODO: error specify! : if found error on model or jwt
    res.status(500).json({ error: { message: "Internal Server Error" } });
  }
}

exports.getUser = getUser;
exports.postLogin = postLogin;
