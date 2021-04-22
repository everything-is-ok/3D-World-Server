const socketIo = require("socket.io")();

const openedRooms = {};

socketIo.on("connection", (socket) => {
  console.log("A user connected to socket");

  socket.on("room", ({ user, roomId }) => {
    console.log(`${user} user join ${roomId}`);

    // NOTE: socket.on("room")의 user, roomId와 closure가 형성되어있기때문에, 별도의 룸 관리가 없어도 될 듯
    // TODO: 사용하지 않는다면 추후 삭제
    openedRooms[roomId]
      ? openedRooms[roomId][socket.id] = user
      : openedRooms[roomId] = { [socket.id]: user };

    console.log("From join room, current opened room list", openedRooms);

    socket.join(roomId);
    socket.broadcast
      .to(roomId)
      .emit("room", { user });

    socket.on("chat", ({ message }) => {
      socket.broadcast
        .to(roomId)
        .emit("chat", { user, message });
    });

    socket.on("move", ({ position, direction }) => {
      console.log(`name: ${user}, position: ${position}, direction: ${direction}`);
      socket.broadcast
        .to(roomId)
        .emit("move", { user, position, direction });
    });

    socket.on("disconnect", () => {
      console.log(`A ${user}user disconnected from socket`);

      // NOTE: socket.on("room")의 user, roomId와 closure가 형성되어있기때문에, 별도의 룸 관리가 없어도 될 듯
      // TODO: 사용하지 않는다면 추후 삭제
      Object.keys(openedRooms[roomId]).length === 1
        ? delete openedRooms[roomId]
        : delete openedRooms[roomId][socket.id];

      console.log("From disconnetion, current opened room list", openedRooms);
    });
  });

  // NOTE: World socket

  socket.on("world", ({ user, position }) => {
    const greeting = `🌐 ${user.name} joined to the world 🌐`;
    socket.join("world1");

    socket.broadcast.to("world1").emit("worldConnection", {
      user,
      position,
      greeting,
    });

    socket.on("changePosition", ({ id, newPosition }) => {
      socket.broadcast.to("world1").emit(`receive_position_${id}`, { newPosition });
    });
  });
});

module.exports = socketIo;
