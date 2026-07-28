const form = document.getElementById("resetPasswordForm");
const message = document.getElementById("message");

const email = localStorage.getItem("resetEmail");


const resetToken = localStorage.getItem("resetToken");

if (!email) {

    window.location.href = "forgot-password.html";

}

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const newPassword = document
        .getElementById("newPassword")
        .value
        .trim();

    const confirmPassword = document
        .getElementById("confirmPassword")
        .value
        .trim();

    if (newPassword !== confirmPassword) {

        message.style.color = "red";
        message.textContent = "Passwords do not match.";

        return;

    }

    try {

        const response = await fetch(`${API_URL}/reset-password`,

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json",

                },


                body: JSON.stringify({

                    newPassword,

                    resetToken,

                }),

            }

        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.message);

        }

        message.style.color = "limegreen";
        message.textContent = data.message;

        // Clear saved email
        localStorage.removeItem("resetEmail");
        localStorage.removeItem("resetToken");


        setTimeout(() => {

            window.location.href = "login.html";

        }, 2000);

    }

    catch (error) {

        message.style.color = "red";
        message.textContent = error.message;

    }

});
