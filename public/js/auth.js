const windowOrigin = `${window.location.origin}/api`;
const form = document.querySelector("form");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = {};

  for (let element of form.elements) {
    const { name, value } = element;
    if (name.length > 0) formData[name] = value;
  }

  fetch(`${windowOrigin}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then(async (response) => {
      const { token } = await response.json();

      localStorage.setItem("token", token);

      window.location = "chat.html";
    })
    .catch(console.warn);
});

function handleCredentialResponse(response) {
  const url = `${windowOrigin}/auth/googleSignIn`;

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      googleToken: response.credential,
    }),
  })
    .then((response) => response.json())
    .then((response) => {
      localStorage.setItem("email", response.user.email);
      window.location = "chat.html";
    })
    .catch(console.warn);
}

const button = document.getElementById("g_id_signout");

button.onclick = async () => {
  google.accounts.id.disableAutoSelect();
  google.accounts.id.revoke(localStorage.getItem("email"), (done) => {
    localStorage.clear();
    location.reload();
  });
};
