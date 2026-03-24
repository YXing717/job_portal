// Load applicants
let applicants = JSON.parse(localStorage.getItem("applicants")) || [
    { name: "John Doe", position: "Backend Developer", status: "Pending", date: "2026-03-20" },
    { name: "Alice Smith", position: "Frontend Developer", status: "Reviewed", date: "2026-03-21" },
    { name: "Michael Tan", position: "Full Stack Developer", status: "Pending", date: "2026-03-18" },
    { name: "Siti Nurhaliza", position: "UI/UX Designer", status: "Pending", date: "2026-03-19" },
    { name: "David Lim", position: "Software Engineer", status: "Reviewed", date: "2026-03-17" },
    { name: "Aisyah Rahman", position: "QA Tester", status: "Pending", date: "2026-03-22" }
];

// Separate updated applicants
let updatedApplicants = JSON.parse(localStorage.getItem("updatedApplicants")) || [];

// Save data
function saveData() {
    localStorage.setItem("applicants", JSON.stringify(applicants));
    localStorage.setItem("updatedApplicants", JSON.stringify(updatedApplicants));
}

// Message
function showMessage(msg, color = "green") {
    let messageDiv = document.getElementById("message");
    messageDiv.style.color = color;
    messageDiv.innerText = msg;
    setTimeout(() => messageDiv.innerText = "", 3000);
}

// Update and MOVE applicant
function updateStatus(index) {
    let select = document.getElementById(`status-${index}`);
    let newStatus = select.value;

    let validStatuses = ["Pending", "Reviewed", "Accepted", "Rejected"];

    if (!validStatuses.includes(newStatus)) {
        showMessage("Invalid status", "red");
        return;
    }

    // Update status
    applicants[index].status = newStatus;

    // Move to updated list
    updatedApplicants.push(applicants[index]);

    // Remove from main list
    applicants.splice(index, 1);

    saveData();
    showMessage("Applicant moved to updated list");

    displayApplicants();
    displayUpdatedApplicants();
}

// Display MAIN list (active)
function displayApplicants() {
    let table = document.getElementById("applicantTable");
    let search = document.getElementById("searchInput").value.toLowerCase();
    let filter = document.getElementById("filterStatus").value;

    table.innerHTML = "";

    applicants.forEach((applicant, index) => {
        if (
            applicant.name.toLowerCase().includes(search) &&
            (filter === "All" || applicant.status === filter)
        ) {
            table.innerHTML += `
                <tr>
                    <td>${applicant.name}</td>
                    <td>${applicant.position}</td>
                    <td>${applicant.status}</td>
                    <td>${applicant.date}</td>
                    <td>
                        <select id="status-${index}">
                            <option ${applicant.status === "Pending" ? "selected" : ""}>Pending</option>
                            <option ${applicant.status === "Reviewed" ? "selected" : ""}>Reviewed</option>
                            <option ${applicant.status === "Accepted" ? "selected" : ""}>Accepted</option>
                            <option ${applicant.status === "Rejected" ? "selected" : ""}>Rejected</option>
                        </select>
                        <button onclick="updateStatus(${index})">Update</button>
                    </td>
                </tr>
            `;
        }
    });
}

// Display UPDATED list (below)
function displayUpdatedApplicants() {
    let table = document.getElementById("updatedTable");
    table.innerHTML = "";

    updatedApplicants.forEach(applicant => {
        table.innerHTML += `
            <tr>
                <td>${applicant.name}</td>
                <td>${applicant.position}</td>
                <td>${applicant.status}</td>
                <td>${applicant.date}</td>
            </tr>
        `;
    });
}

// Events
document.getElementById("searchInput").addEventListener("input", displayApplicants);
document.getElementById("filterStatus").addEventListener("change", displayApplicants);

// Initial load
displayApplicants();
displayUpdatedApplicants();
// Console command to clear localStorage for repeat testing:
// localStorage.clear();