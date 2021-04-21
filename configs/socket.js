const socketIo = require("socket.io")();

const openedRooms = {};

socketIo.on("connection", (socket) => {
  console.log("A user connected to socket");

  socket.on("room", ({ user, roomId }) => {
    console.log(`${user.name} user join ${roomId}`);

    // NOTE: socket.on("room")의 user, roomId와 closure가 형성되어있기때문에, 별도의 룸 관리가 없어도 될 듯
    // TODO: 사용하지 않는다면 추후 삭제
    openedRooms[roomId]
      ? openedRooms[roomId][socket.id] = user.name
      : openedRooms[roomId] = { [socket.id]: user.name };

    console.log("From join room, current opened room list", openedRooms);

    socket.join(roomId);
    socket.broadcast
      .to(roomId)
      .emit("room", { user: user.name });

    socket.on("chat", ({ message }) => {
      socket.broadcast
        .to(roomId)
        .emit("chat", { user: user.name, message });
    });

    socket.on("move", ({ position, direction }) => {
      console.log(`name: ${user.name}, position: ${position}, direction: ${direction}`);
      socket.broadcast
        .to(roomId)
        .emit("move", { user: user.name, position, direction });
    });

    socket.on("disconnect", () => {
      console.log(`A ${user.name}user disconnected from socket`);

      // NOTE: socket.on("room")의 user, roomId와 closure가 형성되어있기때문에, 별도의 룸 관리가 없어도 될 듯
      // TODO: 사용하지 않는다면 추후 삭제
      Object.keys(openedRooms[roomId]).length === 1
        ? delete openedRooms[roomId]
        : delete openedRooms[roomId][socket.id];

      console.log("From disconnetion, current opened room list", openedRooms);
    });
  });
});

module.exports = socketIo;

// TODO: client에서 쏠 때 잘 되는지 실험 필요 & config에 있어야하는지 socket 폴더 따로 빼야하는지 고민
