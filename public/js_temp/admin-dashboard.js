const token = getToken("admin");

if (!token) {

    window.location.href = "admin-login.html";

}

// =========================
// Dashboard Statistics
// =========================

async function loadDashboard() {

    try {

        const response = await fetchWithAuth(`${API_URL}/admin/dashboard`,

            {},

            "admin"

        );

        if (!response) return;

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.message);

        }

        document.getElementById("totalUsers").textContent =
            data.totalUsers;

        document.getElementById("totalFiles").textContent =
            data.totalFiles;

        document.getElementById("uploadsToday").textContent =
            data.uploadsToday;

    } catch (error) {

        console.error(error);

    }

}



async function loadRecentFiles() {

    try {

        const response = await fetchWithAuth(`${API_URL}/admin/recent-files`,

            {},

            "admin"

        );

        if (!response) return;

        const files = await response.json();

        const table = document.getElementById(

            "recentFiles"

        );

        table.innerHTML = "";

        files.forEach((file) => {

            table.innerHTML += `

            <tr>

                <td>${file.originalName}</td>

                <td>${file.owner.name}</td>

                <td>${(file.size / 1024).toFixed(2)} KB</td>

                <td>${new Date(file.createdAt).toLocaleDateString()}</td>

            </tr>

            `;

        });

    } catch (error) {

        console.error(error);

    }

}

// =========================
// Recent Users
// =========================

async function loadRecentUsers() {

    try {

        const response = await fetchWithAuth(`${API_URL}/admin/recent-users`,

            {},

            "admin"

        );

        if (!response) return;

        const users = await response.json();

        const table =
            document.getElementById("recentUsers");

        table.innerHTML = "";

        users.forEach((user) => {

            const row = `

            <tr>

                <td>${user.name}</td>

                <td>${user.email}</td>

                <td>${new Date(user.createdAt).toLocaleDateString()}</td>

            </tr>

            `;

            table.innerHTML += row;

        });

    } catch (error) {

        console.error(error);

    }

}



// =========================

loadDashboard();

loadRecentFiles();

loadRecentUsers();

