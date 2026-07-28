const token = localStorage.getItem("adminToken");

if (!token) {

    window.location.href = "admin-login.html";

}

const form = document.getElementById("profileForm");

const message = document.getElementById("profileMessage");

// Load Admin Profile
async function loadProfile() {

    try {

        const response = await fetch(`${API_URL}/admin/profile`, {

                headers: {

                    Authorization: `Bearer ${token}`,

                },

            }

        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.message);

        }

        document.getElementById("name").value = data.name;

        document.getElementById("email").value = data.email;

    }

    catch (error) {

        console.error(error);

    }

}

// Update Profile
form.addEventListener("submit", async (e) => {

    e.preventDefault();

    try {

        const body = {

            name: document.getElementById("name").value,

            email: document.getElementById("email").value,

        };

        const password = document.getElementById("password").value.trim();

        if (password !== "") {

            body.password = password;

        }

        const response = await fetch(

            `${API_URL}/admin/profile`,

            {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json",

                    Authorization: `Bearer ${token}`,

                },

                body: JSON.stringify(body),

            }

        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.message);

        }

        message.className = "message-box success";

        message.style.display = "block";

        message.textContent = data.message;

        document.getElementById("password").value = "";

    }

    catch (error) {

        message.className = "message-box error";

        message.style.display = "block";

        message.textContent = error.message;

    }

});

// Logout
document.getElementById("logoutBtn").addEventListener("click", (e) => {

    e.preventDefault();

    localStorage.removeItem("adminToken");

    window.location.href = "admin-login.html";

});

loadProfile();