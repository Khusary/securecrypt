const token = getToken("admin");

if (!token) {
    window.location.href = "admin-login.html";
}

let allLogs = [];

async function loadLogs() {

    try {

        const response = await fetchWithAuth(
            `${API_URL}/admin/logs`,
            {},
            "admin"
        );

        if (!response) return;

        const logs = await response.json();

        allLogs = logs;

        renderLogs(logs);

    } catch (error) {

        console.error(error);

    }

}

function renderLogs(logs) {

    const table = document.getElementById("logsTable");

    table.innerHTML = "";

    logs.forEach(log => {

        table.innerHTML += `

        <tr>

            <td>${log.user?.name || "Unknown"}</td>

            <td>${log.action}</td>

            <td>${log.file}</td>

            <td>${log.ipAddress}</td>

            <td>${new Date(log.createdAt).toLocaleString()}</td>

        </tr>

        `;

    });

}

document.getElementById("searchLog")
    .addEventListener("input", filterLogs);

document.getElementById("filterAction")
    .addEventListener("change", filterLogs);

function filterLogs() {

    const keyword = document
        .getElementById("searchLog")
        .value
        .toLowerCase();

    const action = document
        .getElementById("filterAction")
        .value;

    const filtered = allLogs.filter(log => {

        const matchesSearch =

            (log.user?.name || "")
                .toLowerCase()
                .includes(keyword)

            ||

            (log.file || "")
                .toLowerCase()
                .includes(keyword);

        const matchesAction =

            action === ""

            ||

            log.action === action;

        return matchesSearch && matchesAction;

    });

    renderLogs(filtered);

}

loadLogs();