const authURL = `${window.location.origin}/api/auth`;
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
};

const main = async () => {
  await validarJWT();
};

main();
