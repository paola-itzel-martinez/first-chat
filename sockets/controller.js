const { isEmpty } = require("lodash");
const { validateLoginToken } = require("../helpers");
const { ChatMessages } = require("../models");

const chatMessages = new ChatMessages();

const socketController = async (socket, io) => {
  const token = socket.handshake.headers.token;
  const { user } = await validateLoginToken(token);

  if (isEmpty(user)) return socket.disconnect();

  chatMessages.connectUser(user);

  io.emit("activeUsers", chatMessages.usersArray);
  socket.emit("giveMessage", chatMessages.lastTenMessages);
  socket.join(user.id);

  socket.on("disconnect", () => {
    chatMessages.desconnectUser(user.id);

    io.emit("activeUsers", chatMessages.usersArray);
  });

  socket.on("sendMessage", ({ message, uid }) => {
    if (!isEmpty(uid)) {
      socket.to(uid).emit("givePrivateMessage", {
        from: user.name,
        message,
      });
    } else {
      chatMessages.sendMessage({
        uid: user.id,
        name: user.name,
        message,
      });

      io.emit("giveMessage", chatMessages.lastTenMessages);
    }
  });
};

module.exports = {
  socketController,
};
