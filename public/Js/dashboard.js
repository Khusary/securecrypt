const token = localStorage.getItem("token");

if (!token) {

    window.location.href = "login.html";

}

const username = document.getElementById("username");

const totalFiles = document.getElementById("totalFiles");

const storageUsed = document.getElementById("storageUsed");

const lastUpload = document.getElementById("lastUpload");

async function loadDashboard() {

    try {

        const response = await fetch(`${API_URL}/dashboard`, {
            headers: {

                    Authorization:
                        `Bearer ${token}`

                }

            }
        );

        const data = await response.json();

        username.innerHTML =

            `<i class="fa-solid fa-user"></i>
        ${data.user.name}`;

        totalFiles.innerHTML = data.totalFiles;

        storageUsed.innerHTML = data.storageUsed + " MB";

        if (data.lastUpload) {

            lastUpload.innerHTML =
                new Date(data.lastUpload)
                    .toLocaleDateString();

        } else {

            lastUpload.innerHTML =
                "No Upload";

        }

    } catch (error) {

        console.error(error);

    }

}

loadDashboard();

document.getElementById("logoutBtn").addEventListener("click", () => {

    showToast("Logged out successfully", "info");

    setTimeout(() => {

        localStorage.removeItem("token");

        window.location.href = "login.html";

    }, 1000);

});