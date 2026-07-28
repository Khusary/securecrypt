const token = localStorage.getItem("adminToken");

if (!token) {

    window.location.href = "admin-login.html";

}

let allUsers = [];

// =========================
// Load Users
// =========================

async function loadUsers() {

    try {

        const response = await fetch(`${API_URL}/admin/users`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    

        const users = await response.json();

        if (!response.ok) {

            throw new Error(users.message);

        }

        allUsers = users;

        renderUsers(users);

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

}

// =========================
// Render Users
// =========================

function renderUsers(users) {

    const table = document.getElementById("usersTable");

    table.innerHTML = "";

    users.forEach(user => {

        table.innerHTML += `

        <tr>

            <td>${user.name}</td>

            <td>${user.email}</td>

            <td>${user.role}</td>

            <td>${new Date(user.createdAt).toLocaleDateString()}</td>

            <td>

                <button
                    class="action-btn view-btn"
                    onclick="viewUser('${user._id}')">

                    <i class="fa-solid fa-eye"></i>

                </button>

                <button
                    class="action-btn delete-btn"
                    onclick="deleteUser('${user._id}')">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        </tr>

        `;

    });

}

// =========================
// Live Search
// =========================

document.getElementById("searchUser")
.addEventListener("input", function () {

    const keyword = this.value.toLowerCase();

    const filtered = allUsers.filter(user =>

        user.name.toLowerCase().includes(keyword) ||

        user.email.toLowerCase().includes(keyword)

    );

    renderUsers(filtered);

});

// =========================
// View User
// =========================

async function viewUser(id) {

    try {

        const response = await fetchWithAuth(

            `${API_URL}/admin/users/${id}`,

            {},

            "admin"

        );

        if (!response) return;

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.message);

        }

        document.getElementById("modalName").textContent =
            data.user.name;

        document.getElementById("modalEmail").textContent =
            data.user.email;

        document.getElementById("modalRole").textContent =
            data.user.role;

        document.getElementById("modalJoined").textContent =
            new Date(data.user.createdAt).toLocaleDateString();

        document.getElementById("modalFiles").textContent =
            data.totalFiles;

        document.getElementById("modalStorage").textContent =
            (data.totalStorage / (1024 * 1024)).toFixed(2) + " MB";

        document.getElementById("userModal").style.display = "flex";

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

}

// =========================
// Delete User
// =========================

async function deleteUser(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {

        const response = await fetchWithAuth(

            `${API_URL}/admin/users/${id}`,

            {

                method: "DELETE",

            },

            "admin"

        );

        if (!response) return;

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.message);

        }

        alert(data.message);

        loadUsers();

        



    } catch (error) {

        console.error(error);

        alert(error.message);

    }

}

// loadUsers();
// loadDashboard();

// ==========================
// Close Modal
// ==========================

const modal = document.getElementById("userModal");

const closeBtn = document.querySelector(".close-modal");

closeBtn.onclick = function () {

    modal.style.display = "none";

};

window.onclick = function (event) {

    if (event.target === modal) {

        modal.style.display = "none";

    }

};

loadUsers();
loadDashboard();