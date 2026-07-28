
const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const table = document.getElementById("decryptTable");

async function loadFiles() {

    try {

        const response = await fetch(
            `${API_URL}/my-files`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const files = await response.json();

        table.innerHTML = "";

        files.forEach(file => {

            table.innerHTML += `
                <tr>
                    <td>${file.originalName}</td>
                    <td>${file.mimeType}</td>
                    <td>${(file.size / 1024 / 1024).toFixed(2)} MB</td>
                    <td>${new Date(file.createdAt).toLocaleDateString()}</td>
                    <td>🔒 Encrypted</td>
                    <td>
                        <span class="integrity-badge">
                            <i class="fa-solid fa-circle-check"></i>
                            Verified
                        </span>
                    </td>
                    <td>
                        <button
                            class="btn decrypt-btn"
                            onclick="decryptFile('${file._id}')">

                            <i class="fa-solid fa-lock-open"></i>
                            Secure Decrypt

                        </button>
                    </td>
                </tr>
            `;

        });

    } catch (error) {

        console.error(error);
        showToast("Failed to load files.");

    }

}

loadFiles();

async function decryptFile(id) {

    try {

        const otpResponse = await fetch(

            `${API_URL}/decrypt/send-otp`,

            {

                method: "POST",

                headers: {

                    Authorization: `Bearer ${token}`

                }

            }

        );

        if (!otpResponse.ok) {

            const data = await otpResponse.json();

            throw new Error(data.message);

        }

        showToast("OTP has been sent to your email.");

        const modal = document.getElementById("otpModal");
        const otpInput = document.getElementById("otpInput");
        const verifyBtn = document.getElementById("verifyOtpBtn");
        const cancelBtn = document.getElementById("cancelOtpBtn");

        modal.style.display = "flex";
        otpInput.value = "";
        otpInput.focus();

        cancelBtn.onclick = () => {

            modal.style.display = "none";

        };

        verifyBtn.onclick = async () => {

            try {

                const otp = otpInput.value.trim();

                if (!otp) {

                    showToast("Please enter the OTP.");

                    return;

                }

                verifyBtn.disabled = true;

                const verifyResponse = await fetch(`${API_URL}/decrypt/verify-otp`, {

                        method: "POST",

                        headers: {

                            "Content-Type": "application/json",

                            Authorization: `Bearer ${token}`

                        },

                        body: JSON.stringify({

                            otp

                        })

                    }

                );

                if (!verifyResponse.ok) {

                    const data = await verifyResponse.json();

                    throw new Error(data.message);

                }

                modal.style.display = "none";

                const response = await fetch(

                    `${API_URL}/decrypt/${id}`,

                    {

                        method: "GET",

                        headers: {

                            Authorization: `Bearer ${token}`

                        }

                    }

                );

                if (!response.ok) {

                    const data = await response.json();

                    throw new Error(data.message);

                }

                const blob = await response.blob();

                const url = window.URL.createObjectURL(blob);

                const a = document.createElement("a");

                a.href = url;

                a.download = "Decrypted_File";

                document.body.appendChild(a);

                a.click();

                a.remove();

                showToast("File decrypted successfully.");

            }

            catch (error) {

                console.error(error);

                showToast(error.message);

            }

            finally {

                verifyBtn.disabled = false;

            }

        };

    }

    catch (error) {

        console.error(error);

        showToast(error.message);

    }

}
