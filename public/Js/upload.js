const uploadForm = document.getElementById("uploadForm");
const message = document.getElementById("message");

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

uploadForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const fileInput = document.getElementById("file");

    if (!fileInput.files.length) {
        message.style.color = "red";
        showToast("Please select a file");
        return;
    }

    const formData = new FormData();

    formData.append("file", fileInput.files[0]);

    try {

        const response = await fetch(
            `${API_URL}/upload`,
            {
                method: "POST",

                headers: {
                    Authorization: `Bearer ${token}`
                },

                body: formData
            }
        );

        const data = await response.json();

        if (response.ok) {

            showToast(data.message, "success");

            uploadForm.reset();

            document.getElementById("selectedFile").innerHTML = "";

        } else {

            showToast(data.message, "error");

        }

    } catch (error) {

        console.error(error);

        message.style.color = "#ef4444";
        showToast("Upload failed.", "error");

    }

});