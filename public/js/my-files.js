const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const table = document.getElementById("fileTable");

async function loadFiles() {

    try {

        const response = await fetch(`${API_URL}/my-files`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const files = await response.json();

        table.innerHTML = "";

        files.forEach(file => {

            table.innerHTML += `
            <tr>

                <td>${file.originalName}</td>

                <td>${file.mimeType}</td>

                <td>${(file.size / 1024 / 1024).toFixed(2)} MB</td>

                <td>${new Date(file.createdAt).toLocaleDateString()}</td>

                <td>
                    🔒 Encrypted
                </td>

                <td>

    <button
        class="btn download-btn"
        onclick="downloadFile('${file._id}')">

        Download

    </button>


    <button
        class="btn delete-btn"
        onclick="deleteFile('${file._id}')">

        <i class="fa-solid fa-trash"></i>

        Delete

    </button>

</td>
            </tr>
            `

        });

    } catch (error) {

        console.error(error);

    }

}

loadFiles();

function downloadFile(id) {

    const token = localStorage.getItem("token");

    fetch(`${API_URL}/download/${id}`, {

        headers: {
            Authorization: `Bearer ${token}`
        }

    })
        .then(response => {

            if (!response.ok) {

                throw new Error("Download failed");

            }

            return response.blob();

        })
        .then(blob => {

            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");

            a.href = url;

            a.download = "EncryptedFile.enc";

            document.body.appendChild(a);

            a.click();

            a.remove();

        })
        .catch(error => {

            console.error(error);

            alert("Download failed.");

        });

}


// async function decryptFile(id) {

//     const token = localStorage.getItem("token");

//     try {

//         const response = await fetch(

//             `http://localhost:3000/decrypt/${id}`,

//             {

//                 method: "GET",

//                 headers: {

//                     Authorization: `Bearer ${token}`

//                 }

//             }

//         );

//         if (!response.ok) {

//             const data = await response.json();

//             throw new Error(data.message);

//         }

//         const blob = await response.blob();

//         const url = window.URL.createObjectURL(blob);

//         const a = document.createElement("a");

//         a.href = url;

//         a.download = "DecryptedFile";

//         document.body.appendChild(a);

//         a.click();

//         a.remove();

//         showToast("File decrypted successfully.");

//     } catch (error) {

//         console.error(error);

//         showToast(error.message);

//     }

// }

async function deleteFile(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this file?"
    );

    if (!confirmed) return;

    const token = localStorage.getItem("token");

    try {

        const response = await fetch(`${API_URL}/delete/${id}`,

            {

                method: "DELETE",

                headers: {

                    Authorization: `Bearer ${token}`

                }

            }

        );

        const data = await response.json();

        showToast("File deleted successfully");

        loadFiles();

    } catch (error) {

        console.error(error);

    }

}

function showToast(message) {

    const toast = document.getElementById("toast");

    toast.innerHTML = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}