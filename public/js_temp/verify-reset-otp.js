
const form = document.getElementById("verifyResetForm");
const message = document.getElementById("message");

// Autofill email if available
const savedEmail = localStorage.getItem("resetEmail");

if (savedEmail) {
    document.getElementById("email").value = savedEmail;
}

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    try {

        const email = document.getElementById("email").value.trim();

        const otp = document.getElementById("otp").value.trim();

        const response = await fetch(`${API_URL}/verify-reset-otp`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    otp,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.message);

        }

        message.style.color = "limegreen";
        message.textContent = data.message;

        // Save email 

        localStorage.setItem("resetEmail", email);

        // save secure reset token

        localStorage.setItem(

            "resetToken",

            data.resetToken

        );


        setTimeout(() => {

            window.location.href = "reset-password.html";

        }, 1500);

    }

    catch (error) {

        message.style.color = "red";
        message.textContent = error.message;

    }

});
