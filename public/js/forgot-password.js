
const form = document.getElementById("forgotForm");
const messageBox = document.getElementById("message");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    try {

        const email = document.getElementById("email").value.trim();

        const response = await fetch(`${API_URL}/forgot-password`, {

                method: "POST",

                headers: {

                    "Content-Type": "application/json",

                },

                body: JSON.stringify({ email }),

            }

        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.message);

        }

        messageBox.style.color = "limegreen";
        messageBox.textContent = data.message;


        // Save email for next page
        localStorage.setItem("resetEmail", email);

        setTimeout(() => {

            window.location.href = "verify-reset-otp.html";

        }, 2000);

    }

    catch (error) {

        messageBox.style.color = "red";


        messageBox.textContent = error.message;

    }

});
