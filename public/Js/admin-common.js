
// Check Admin Token
const adminToken = localStorage.getItem("adminToken");

if (!adminToken) {

    window.location.href = "admin-login.html";

}

// Logout
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", (e) => {

        e.preventDefault();

        const confirmLogout = confirm("Are you sure you want to logout?");

        if (!confirmLogout) return;

        localStorage.removeItem("adminToken");

        window.location.href = "admin-login.html";

    });

}

// Mobile Sidebar Toggle

const menuToggle = document.getElementById("menuToggle");

const sidebar = document.querySelector(".admin-sidebar");

if (menuToggle && sidebar) {

    menuToggle.addEventListener("click", (e) => {

        e.stopPropagation();

        sidebar.classList.toggle("active");

    });

    sidebar.addEventListener("click", (e) => {

        e.stopPropagation();

    });

    document.addEventListener("click", () => {

        sidebar.classList.remove("active");

    });

}

