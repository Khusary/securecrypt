
const token = getToken("admin");

if (!token) {

    window.location.href = "admin-login.html";

}

let allFiles = [];

async function loadFiles() {

    try {

        const response = await fetchWithAuth(

            `${API_URL}/admin/files`,

            {},

            "admin"

        );

        if (!response) return;

        const files = await response.json();

        allFiles = files;

        renderFiles(files);

    }

    catch (error) {

        console.error(error);

    }

}


function renderFiles(files) {

    const table = document.getElementById("filesTable");

    table.innerHTML = "";

    files.forEach(file => {

        table.innerHTML += `

        <tr>

            <td>${file.originalName}</td>

            <td>${file.owner.name}</td>

            <td>${(file.size / 1024).toFixed(2)} KB</td>

            <td>${new Date(file.createdAt).toLocaleDateString()}</td>

            <td>

                <button class="action-btn delete-btn"
                 onclick="deleteFile('${file._id}')">

                <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        </tr>

        `;

    });

}

document.getElementById("searchFile")
    .addEventListener("input", function () {

        const keyword = this.value.toLowerCase();

        const filtered = allFiles.filter(file =>

            file.originalName.toLowerCase().includes(keyword) ||

            file.owner.name.toLowerCase().includes(keyword)

        );

        renderFiles(filtered);

    });


async function deleteFile(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this file?"
    );

    if (!confirmDelete) return;

    try {

        const response = await fetchWithAuth(

            `${API_URL}/admin/files/${id}`,

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

        loadFiles();

        // loadDashboard();

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

}

// loadDashboard();
loadFiles();