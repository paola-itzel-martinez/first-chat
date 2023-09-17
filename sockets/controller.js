const socketController = (socket) => {
  console.log(socket.handshake.headers["token"]);
};

module.exports = {
  socketController,
};
