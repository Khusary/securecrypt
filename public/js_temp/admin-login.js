const existingToken = getToken("admin");

if (existingToken) {

    window.location.href = "admin-dashboard.html";

}

const form = document.getElementById("adminLoginForm");

const loginBtn = document.getElementById("loginBtn");

const btnText = document.getElementById("btnText");

const messageBox = document.getElementById("loginMessage");

const passwordInput = document.getElementById("password");

const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", () => {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        togglePassword.classList.remove("fa-eye");

        togglePassword.classList.add("fa-eye-slash");

    } else {

        passwordInput.type = "password";

        togglePassword.classList.remove("fa-eye-slash");

        togglePassword.classList.add("fa-eye");

    }

});

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    messageBox.className = "message-box";

    messageBox.style.display = "none";

    loginBtn.disabled = true;

    btnText.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Signing In...';

    try {

        const response = await fetch(`${API_URL}/admin/login`, {

                method: "POST",

                headers: {

                    "Content-Type": "application/json",

                },

                body: JSON.stringify({

                    email: document.getElementById("email").value,

                    password: document.getElementById("password").value,

                }),

            }

        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.message);

        }

        localStorage.setItem(

            "adminToken",

            data.token

        );

        messageBox.classList.add("success");

        messageBox.style.display = "block";

        messageBox.textContent =
            "Login successful. Redirecting...";

        setTimeout(() => {

            window.location.href =
                "admin-dashboard.html";

        }, 1000);

    } catch (error) {

        messageBox.classList.add("error");

        messageBox.style.display = "block";

        messageBox.textContent = error.message;

    } finally {

        loginBtn.disabled = false;

        btnText.textContent = "Login";

    }

});
