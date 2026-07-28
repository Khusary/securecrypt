const token = localStorage.getItem("token");

if (!token) {

    window.location.href = "login.html";

}

async function loadProfile() {

    try {

        const response = await fetch(`${API_URL}/profile`,
            {

                headers: {

                    Authorization: `Bearer ${token}`

                }

            }
        );

        const data = await response.json();

        if (!response.ok) {

            showToast(data.message || "Failed to load profile.");

            return;

        }

        document.getElementById("name").innerHTML =
            data.name;

        document.getElementById("email").innerHTML =
            data.email;

        document.getElementById("joined").innerHTML =
            "Joined: " +
            new Date(data.joined).toLocaleDateString();

        document.getElementById("totalFiles").innerHTML =
            data.totalFiles;

        document.getElementById("storageUsed").innerHTML =
            (data.storageUsed / 1024 / 1024).toFixed(2) + " MB";

    } catch (error) {

        // console.error(error);

        showToast("Unable to load profile.");

    }

}

function logout() {

    localStorage.removeItem("token");

    window.location.href = "login.html";

}

loadProfile();