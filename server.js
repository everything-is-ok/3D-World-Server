// NOTE: 상황에 따라 env.NODE_ENV 설정을 넣을 수도 있다.(ex. isProduction)
require("dotenv").config();

const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");
const logger = require("morgan");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");

const router = require("./routes/index");
const db = require("./configs/db");
const socketIo = require("./configs/socket");

const app = express();
const server = http.createServer(app);

app.use(logger("dev"));
app.use(cors({
  origin: true,
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

db.init();

socketIo.listen(server, {
  cors: {
    origin: [process.env.CLIENT_URL],
  },
});

app.use("/", router);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404, "Not found page"));
});

// error handler
app.use((err, req, res, next) => {
  console.log("💥", err);
  // TODO: 분기를 활용하여 에러핸들링
  // set locals, only providing error in development
  // req.app.get("env") === "development" ? err : {};
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join(". ")}`;

    err.status = 400;
    err.message = message;
  }

  if (err.code === 11000) {
    err.status = 400;
    err.message = "A email must be unique.";
  }

  res.status(err.status || 500);
  res.json({ ok: false, error: { message: err.message } });
});

// NOTE: 현재 파일이름을 app, index, server 뭐가 나을지...? exports 하는게 app이라.

module.exports = { app, server };
