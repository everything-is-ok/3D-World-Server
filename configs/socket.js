const io = require("socket.io")();

const socket = {
  io,
};

io.on("connection", (socket) => {
  console.log("A user connected to socket");

  socket.on("room", ({ user, roomId }) => {
    console.log(`${user.name} user join ${roomId}`);

    socket.join(roomId);
    socket.broadcast
      .to(roomId)
      .emit("room", user);

    socket.on("chat", ({ message }) => {
      socket.broadcast
        .to(roomId)
        .emit("chat", { message });
    });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected from socket");
  });
});

module.exports = socket;

// TODO: client에서 쏠 때 잘 되는지 실험 필요 & config에 있어야하는지 socket 폴더 따로 빼야하는지 고민
