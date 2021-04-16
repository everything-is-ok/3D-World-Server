const io = require("socket.io")();

const socket = {
  io,
};

io.on("connection", (socket) => {
  console.log("A user connected to socket");
});

module.exports = socket;

// TODO: client에서 쏠 때 잘 되는지 실험 필요 & config에 있어야하는지 socket 폴더 따로 빼야하는지 고민
