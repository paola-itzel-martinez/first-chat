class Message {
  constructor({ uid, name, message }) {
    this.uid = uid;
    this.name = name;
    this.message = message;
  }
}

class ChatMessage {
  constructor() {
    this.messages = [];
    this.users = {};
  }

  get lastTenMessages() {
    this.messages = this.messages.splice(0, 10);

    return this.messages;
  }

  get usersArray() {
    return Object.values(this.users);
  }

  sendMessage(params) {
    this.messages.unshift(new Message(params));
  }

  connectUser(user) {
    this.users[user.id] = user;
  }

  desconnectUser(id) {
    delete this.users[id];
  }
}

module.exports = ChatMessage;
