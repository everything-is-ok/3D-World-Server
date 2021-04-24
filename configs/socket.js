const socketIo = require("socket.io")();

const openedRooms = {};

socketIo.on("connection", (socket) => {
  console.log("A user connected to socket");

  socket.on("room", ({ user, roomId }) => {
    console.log(`${user.name} user join ${roomId}`);

    // NOTE: socket.on("room")의 user, roomId와 closure가 형성되어있기때문에, 별도의 룸 관리가 없어도 될 듯
    // TODO: 사용하지 않는다면 추후 삭제
    openedRooms[roomId]
      ? openedRooms[roomId][user.id] = { name: user.name, socketId: socket.id }
      : openedRooms[roomId] = { [user.id]: { name: user.name, socketId: socket.id } };

    console.log("From join room, current opened room list", openedRooms);

    socket.on("chat", ({ message }) => {
      socket.broadcast
        .to(roomId)
        .emit("chat", { user: user.name, message });
    });

    socket.on("move", ({ position, direction }) => {
      console.log(`name: ${user.name}, position: ${position}, direction: ${direction}`);
      socket.broadcast
        .to(roomId)
        .emit("move", { user, position, direction });
    });

    // NOTE end Edit mode, database update
    socket.on("update", ({ _id, position }) => {
      console.log(`${_id}, ${position}`);
      socket.broadcast
        .to(roomId)
        .emit("update", { _id, position });
    });

    socket.on("participants", ({ listener, posInfo }) => {
      console.log(listener);
      socketIo.to(openedRooms[roomId][listener].socketId).emit("participants", { ...posInfo, socketId: socket.id });
    });

    socket.join(roomId);
    socket.broadcast
      .to(roomId)
      .emit("room", { ...user, socketId: socket.id });

    socket.on("disconnect", () => {
      console.log(`A ${user.name}user disconnected from socket`);

      socket.broadcast
        .to(roomId)
        .emit("leave", user);

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

  // NOTE: World socket

  socket.on("world", ({ user, position, direction }) => {
    socket.join("world1");

    socket.broadcast.to("world1").emit("worldConnection", {
      user,
      position,
      direction,
    });

    socket.broadcast.to("world1").emit("newUser");

    socket.on("changePosition", ({ id, newPosition, newDirection }) => {
      socket.broadcast.to("world1").emit(`receive_position_${id}`, { newPosition, newDirection });
    });

    socket.on("sendPosition", ({ user: oldUser, position: oldUserPosition, direction: oldUserDirection }) => {
      socket.broadcast.to("world1").emit("worldConnection", {
        user: oldUser,
        position: oldUserPosition,
        direction: oldUserDirection,
      });
    });
  });
});

module.exports = socketIo;
