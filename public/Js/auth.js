// ===============================
// Authentication Helper
// ===============================

function getToken(type = "user") {

    if (type === "admin") {
        return localStorage.getItem("adminToken");
    }

    return localStorage.getItem("token");

}

// ===============================
// Logout
// ===============================

function logout(type = "user") {

    if (type === "admin") {

        localStorage.removeItem("adminToken");

        window.location.href = "admin-login.html";

        return;

    }

    localStorage.removeItem("token");

    window.location.href = "login.html";

}

// ===============================
// Handle Unauthorized
// ===============================

async function fetchWithAuth(url, options = {}, type = "user") {

    const token = getToken(type);

    if (!token) {

        logout(type);

        return;

    }

    options.headers = {

        ...(options.headers || {}),

        Authorization: `Bearer ${token}`,

    };

    const response = await fetch(url, options);

    if (response.status === 401 || response.status === 403) {

        alert("Your session has expired. Please login again.");

        logout(type);

        return null;

    }

    return response;

}