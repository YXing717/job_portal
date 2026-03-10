let currentEditIndex = null;

// ------------------ Apply Job Function ------------------
function applyJob(title, company, btnId){
    let applications = JSON.parse(localStorage.getItem("applications")) || [];

    // check if already applied
    if(applications.some(a => a.title===title && a.company===company)){
        alert("You already applied!");
        return;
    }

    let application = {
        title: title,
        company: company,
        date: new Date().toLocaleDateString(),
        status: "Submitted",
        interviewDate: "",
        interviewTime: ""
    };

    applications.push(application);
    localStorage.setItem("applications", JSON.stringify(applications));

    // update button
    let btn = document.getElementById(btnId);
    btn.innerText = "Applied";
    btn.disabled = true;

    alert("Application submitted!");
}

// ------------------ Initialize Apply Buttons ------------------
window.onload = function(){
    // Apply page buttons
    let jobs = document.querySelectorAll(".job");
    jobs.forEach(job => {
        let title = job.getAttribute("data-title");
        let company = job.getAttribute("data-company");
        let btn = job.querySelector("button");
        let btnId = btn.id;

        // Check if already applied
        let applications = JSON.parse(localStorage.getItem("applications")) || [];
        if(applications.some(a => a.title===title && a.company===company)){
            btn.innerText = "Applied";
            btn.disabled = true;
        }

        // Attach onclick event
        btn.onclick = function(){
            applyJob(title, company, btnId);
        }
    });

    // Dashboard display
    displayDashboard();

    // Employer panel display
    displayEmployer();
}

// ------------------ Dashboard Display ------------------
function displayDashboard(){
    let dashboardTable = document.getElementById("dashboardTable");
    if(!dashboardTable) return;

    let applications = JSON.parse(localStorage.getItem("applications")) || [];
    dashboardTable.innerHTML = "";

    if(applications.length === 0){
        dashboardTable.innerHTML = "<tr><td colspan='5'>No applications found</td></tr>";
    } else {
        applications.forEach(app => {
            let statusClass = app.status.replace(/\s/g,'');
            let row = document.createElement("tr");
            row.innerHTML = `
                <td>${app.title}</td>
                <td>${app.company}</td>
                <td>${app.date}</td>
                <td><span class="status ${statusClass}">${app.status}</span></td>
                <td>${app.interviewDate || '-'} ${app.interviewTime || ''}</td>
            `;
            dashboardTable.appendChild(row);
        });
    }
}

// ------------------ Employer Panel Display ------------------
function displayEmployer(){
    let employerTable = document.getElementById("employerTable");
    if(!employerTable) return;

    let applications = JSON.parse(localStorage.getItem("applications")) || [];
    employerTable.innerHTML = "";

    applications.forEach((app,index) => {
        let statusClass = app.status.replace(/\s/g,'');
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${app.title}</td>
            <td>${app.company}</td>
            <td>${app.date}</td>
            <td><span class="status ${statusClass}">${app.status}</span></td>
            <td>${app.interviewDate || '-'} ${app.interviewTime || ''}</td>
            <td><button onclick="openModal(${index})">View</button></td>
        `;
        employerTable.appendChild(row);
    });
}

// ------------------ Modal Logic ------------------
let modal = document.getElementById("modal");
if(modal){
    document.getElementById("close-modal").onclick = () => modal.style.display = "none";
    window.onclick = function(event){
        if(event.target == modal){
            modal.style.display = "none";
        }
    }
}

// Open modal for editing
function openModal(index){
    currentEditIndex = index;
    let applications = JSON.parse(localStorage.getItem("applications")) || [];
    let app = applications[index];

    document.getElementById("status-select").value = app.status;
    document.getElementById("interview-date").value = app.interviewDate || "";
    document.getElementById("interview-time").value = app.interviewTime || "";

    toggleInterviewInputs();
    modal.style.display = "block";
}

// Show/hide interview inputs
function toggleInterviewInputs(){
    let status = document.getElementById("status-select").value;
    let inputs = document.getElementById("interviewInputs");
    if(status === "Interview Scheduled"){
        inputs.style.display = "block";
    } else {
        inputs.style.display = "none";
    }
}

// Save status and interview info
function saveStatus(){
    let applications = JSON.parse(localStorage.getItem("applications")) || [];
    let newStatus = document.getElementById("status-select").value;

    applications[currentEditIndex].status = newStatus;

    if(newStatus === "Interview Scheduled"){
        applications[currentEditIndex].interviewDate = document.getElementById("interview-date").value;
        applications[currentEditIndex].interviewTime = document.getElementById("interview-time").value;
    } else {
        applications[currentEditIndex].interviewDate = "";
        applications[currentEditIndex].interviewTime = "";
    }

    localStorage.setItem("applications", JSON.stringify(applications));
    modal.style.display = "none";

    // Refresh tables
    displayDashboard();
    displayEmployer();
}