const socketIo = require("socket.io")();

socketIo.on("connection", (socket) => {
  console.log("🔗A user connected to socket");

  socket.on("join room", ({ user, roomId }) => {
    console.log(`🏚${user.name} user join ${roomId}`);

    socket.join(roomId);
    socket.broadcast
      .to(roomId)
      .emit("join room", { ...user });

    socket.broadcast
      .to(roomId)
      .emit("new user socket id", { socketId: socket.id });

    socket.on("user movement", ({ position, direction }) => {
      socket.broadcast
        .to(roomId)
        .emit("user movement", { user, position, direction });
    });

    socket.on("old user info", ({ listener, posInfo }) => {
      socketIo.to(listener).emit("old user info", posInfo);
    });

    socket.on("chat message", ({ message }) => {
      socket.broadcast
        .to(roomId)
        .emit("chat message", { user: user.name, message });
    });

    // NOTE end Edit mode, database update
    socket.on("update", ({ _id, position }) => {
      socket.broadcast
        .to(roomId)
        .emit("update", { _id, position });
    });

    socket.on("disconnect", () => {
      console.log(`A ${user.name}user disconnected from socket`);

      socket.broadcast
        .to(roomId)
        .emit("leave room", user);
    });
  });

  // NOTE: World socket
  socket.on("join world", (userInfo) => {
    socket.join("world1");

    socket.broadcast
      .to("world1")
      .emit("join world", userInfo);

    socket.broadcast
      .to("world1")
      .emit("new user socket id", { socketId: socket.id });

    socket.on("user movement", ({ id, newPosition, newDirection }) => {
      socket.broadcast
        .to("world1")
        .emit(`update movement:${id}`, { newPosition, newDirection });
    });

    socket.on("old user info", ({ listener, userInfo: oldUserInfo }) => {
      socketIo
        .to(listener)
        .emit("old user info", oldUserInfo);
    });

    socket.on("disconnect", () => {
      socket.broadcast
        .to("world1")
        .emit("leave world", userInfo);
    });
  });
});

module.exports = socketIo;
