// LOAD DATA
let applicants = JSON.parse(localStorage.getItem("applicants")) || [
    { name: "John", position: "Backend Developer", status: "Pending" },
    { name: "Alice", position: "Frontend Developer", status: "Reviewed" }
];

// SAVE DATA
function saveData() {
    localStorage.setItem("applicants", JSON.stringify(applicants));
}

// DISPLAY
function displayApplicants() {
    let tableBody = document.querySelector("tbody");
    tableBody.innerHTML = "";

    applicants.forEach((applicant, index) => {
        let row = `
            <tr>
                <td>${applicant.name}</td>
                <td>${applicant.position}</td>
                <td>${applicant.status}</td>
                <td>
                    <select id="status-${index}">
                        <option ${applicant.status==="Pending"?"selected":""}>Pending</option>
                        <option ${applicant.status==="Reviewed"?"selected":""}>Reviewed</option>
                        <option ${applicant.status==="Accepted"?"selected":""}>Accepted</option>
                        <option ${applicant.status==="Rejected"?"selected":""}>Rejected</option>
                    </select>
                    <button onclick="updateStatus(${index})">Update</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// UPDATE
function updateStatus(index) {
    let newStatus = document.getElementById(`status-${index}`).value;

    let validStatuses = ["Pending", "Reviewed", "Accepted", "Rejected"];

    if (!validStatuses.includes(newStatus)) {
        alert("Invalid status selected!");
        return;
    }

    applicants[index].status = newStatus;

    saveData();

    alert("Status updated successfully");

    displayApplicants();
}

// LOAD
displayApplicants();