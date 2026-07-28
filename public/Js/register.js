const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");

registerForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.getElementById("name").value.trim();

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value;

    const confirmPassword = document.getElementById("confirmPassword").value;


    if (password !== confirmPassword) {

        message.style.color = "#ef4444";
        message.innerHTML = "Passwords does not match";

        return;

    }

    try {

        const response = await fetch(`${API_URL}/register`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                name,
                email,
                password

            })

        });

        const data = await response.json();

        if (response.ok) {

            message.style.color = "#22c55e";

            showToast("Registration Successful");

            setTimeout(() => {

                localStorage.setItem(
                    "verifyEmail",
                    data.email
                );

                window.location.href =
                    "verify-email.html";

            }, 1500);

        } else {

            message.style.color = "#ef4444";

            showToast("User already exists", "warning");

        }

    } catch (error) {

        console.error(error);

        message.style.color = "#ef4444";

        message.innerHTML = "Server Error";

    }

});