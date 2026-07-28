
const form = document.getElementById("verifyForm");
const messageBox = document.getElementById("messageBox");

const savedEmail = localStorage.getItem("verifyEmail");

if (savedEmail) {

    document.getElementById("email").value = savedEmail;

}

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    try {

        const response = await fetch(

            `${API_URL}/verify-email`,

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json",

                },

                body: JSON.stringify({

                    email: document.getElementById("email").value.trim(),

                    otp: document.getElementById("otp").value.trim(),

                }),

            }

        );

        document.getElementById("resendOTP").addEventListener("click", async (e) => {

            e.preventDefault();

            const email = document.getElementById("email").value.trim();

            if (!email) {

                messageBox.style.display = "block";

                messageBox.className = "message-box error";

                messageBox.textContent = "Please enter your email first.";

                return;

            }

            try {

                const response = await fetch(`${API_URL}/resend-otp`, {

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

                messageBox.style.display = "block";

                messageBox.className = "message-box success";

                messageBox.textContent = data.message;

            }

            catch (error) {

                messageBox.style.display = "block";

                messageBox.className = "message-box error";

                messageBox.textContent = error.message;

            }

        });

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.message);

        }

        messageBox.style.display = "block";
        messageBox.className = "message-box success";
        messageBox.textContent = data.message;

        setTimeout(() => {

            window.location.href = "login.html";

        }, 2000);

    }

    catch (error) {

        messageBox.style.display = "block";
        messageBox.className = "message-box error";
        messageBox.textContent = error.message;

    }

});
