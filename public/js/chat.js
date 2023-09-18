const authURL = `${window.location.origin}/api/auth`;
const inputUID = document.querySelector("#inputUID");
const inputMessage = document.querySelector("#inputMessage");
const usersList = document.querySelector("#usersList");
const messagesList = document.querySelector("#messagesList");

let user = null;
let socket = null;

const validarJWT = async () => {
  const token = localStorage.getItem("token") || "";

  if (token.length <= 10) window.location = "index.html";

  fetch(authURL, {
    headers: {
      Authorization: token,
    },
  })
    .then(async (response) => {
      const { user: userDB, token: tokenDB } = await response.json();

      localStorage.setItem("token", tokenDB);

      user = userDB;

      document.title = user.name;
    })
    .catch(console.warn);

  await connectSocket();
};

const connectSocket = async () => {
  socket = io({
    extraHeaders: {
      token: localStorage.getItem("token"),
    },
  });

  socket.on("connect", () => {
    console.log("Connect");
  });

  socket.on("disconnect", () => {
    console.log("offline");
  });

  socket.on("giveMessage", setMessagesList);

  socket.on("activeUsers", setUserList);

  socket.on("givePrivateMessage", (payload) => {
    console.log("givePrivateMessage", payload);
  });
};

const setUserList = (users = []) => {
  let usersHTML = "";

  users.forEach(({ name, uid }) => {
    usersHTML += `
      <li>
        <p>
          <h5 class="text-success">${name}</h5>
          <span class="fs-6 text-muted">${uid}</span>
        </p>
      </li>
    `;

    usersList.innerHTML = usersHTML;
  });
};

const setMessagesList = (messages = []) => {
  let innerHTML = "";

  messages.forEach(({ name, message }) => {
    innerHTML += `
      <li>
        <p>
          <span class="text-primary">${name}</span>
          <span>${message}</span>
        </p>
      </li>
    `;

    messagesList.innerHTML = innerHTML;
  });
};

inputMessage.addEventListener("keyup", ({ keyCode }) => {
  if (keyCode !== 13) return;

  const message = String(inputMessage.value).trim();

  if (message === "") return;

  const uid = String(inputUID.value).trim();

  socket.emit("sendMessage", { message, uid });

  inputMessage.value = "";
});

const main = async () => {
  await validarJWT();
};

main();
