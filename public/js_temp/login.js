const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {

    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (response.ok) {

      localStorage.setItem("token", data.token);

      showToast("Login Successful");

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);

    } else {

      showToast(data.message, "error");

    }

  } catch (error) {

    showToast("Server Error", "error");

    console.error(error);

  }
});