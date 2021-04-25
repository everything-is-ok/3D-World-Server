const socketIo = require("socket.io")();

const openedRooms = {};

socketIo.on("connection", (socket) => {
  console.log("A user connected to socket");

  socket.on("join room", ({ user, roomId }) => {
    console.log(`${user.name} user join ${roomId}`);

    // NOTE: socket.on("room")의 user, roomId와 closure가 형성되어있기때문에, 별도의 룸 관리가 없어도 될 듯
    // TODO: 사용하지 않는다면 추후 삭제
    openedRooms[roomId]
      ? openedRooms[roomId][user.id] = { name: user.name, socketId: socket.id }
      : openedRooms[roomId] = { [user.id]: { name: user.name, socketId: socket.id } };

    console.log("From join room, current opened room list", openedRooms);

    socket.join(roomId);
    socket.broadcast
      .to(roomId)
      .emit("join room", { ...user });

    // NOTE: 네이밍 규칙 조언 구해야함
    socket.broadcast
      .to(roomId)
      .emit("new user socket id", { socketId: socket.id });

    socket.on("chat message", ({ message }) => {
      socket.broadcast
        .to(roomId)
        .emit("chat message", { user: user.name, message });
    });

    socket.on("user movement", ({ position, direction }) => {
      console.log(`name: ${user.name}, position: ${position}, direction: ${direction}`);
      socket.broadcast
        .to(roomId)
        .emit("user movement", { user, position, direction });
    });

    socket.on("old user info", ({ listener, posInfo }) => {
      socketIo.to(listener).emit("old user info", { ...posInfo });
    });

    // NOTE end Edit mode, database update
    socket.on("update", ({ _id, position }) => {
      console.log(`${_id}, ${position}`);
      socket.broadcast
        .to(roomId)
        .emit("update", { _id, position });
    });

    socket.on("disconnect", () => {
      console.log(`A ${user.name}user disconnected from socket`);

      socket.broadcast
        .to(roomId)
        .emit("leave room", user);

      // NOTE: socket.on("room")의 user, roomId와 closure가 형성되어있기때문에, 별도의 룸 관리가 없어도 될 듯
      // TODO: 사용하지 않는다면 추후 삭제
      try {
        openedRooms[roomId] && Object.keys(openedRooms[roomId]).length === 1
          ? delete openedRooms[roomId]
          : delete openedRooms[roomId][user.id];

        console.log("From disconnetion, current opened room list", openedRooms);
      } catch (err) {
        console.log(err);
      }
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
