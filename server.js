if (process.env.NODE_ENV) {
  // TODO isproduction 이나 isDev 등 사용시, 변수로 할당해도 좋을 듯
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const cors = require("cors");
const logger = require("morgan");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");

const router = require("./routes/index");
const db = require("./configs/db");
const socket = require("./configs/socket");

const app = express();
const server = require("http").createServer(app);

// NOTE: logger가 맨 위에 있어야 할것 같아서 그렇게 배치함, 확인 필요합니다.
app.use(logger("dev"));
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

db.init();

// NOTE: old version : socket.io.attach(server);
socket.io.listen(server, {
  cors: {
    origin: [process.env.CLIENT_URL],
  },
});

app.use("/", router);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  // TODO: render 지우고 클라이언트로 에러 보내기.
  res.render("error");
});

// NOTE: 현재 파일이름을 app, index, server 뭐가 나을지...? exports 하는게 app이라.

module.exports = { app, server };
