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
        status: "Submitted"
    };

    applications.push(application);
    localStorage.setItem("applications", JSON.stringify(applications));

    // update button
    let btn = document.getElementById(btnId);
    btn.innerText = "Applied";
    btn.disabled = true;

    alert("Application submitted!");
}

// ------------------ Dashboard Display ------------------
let dashboardTable = document.getElementById("dashboardTable");
if(dashboardTable){
    let applications = JSON.parse(localStorage.getItem("applications")) || [];
    dashboardTable.innerHTML = "";

    if(applications.length === 0){
        dashboardTable.innerHTML = "<tr><td colspan='4'>No applications found</td></tr>";
    } else {
        applications.forEach(app => {
            // Fix status class: remove spaces for CSS
            let statusClass = app.status.replace(/\s/g,'');
            let row = document.createElement("tr");
            row.innerHTML = `
                <td>${app.title}</td>
                <td>${app.company}</td>
                <td>${app.date}</td>
                <td><span class="status ${statusClass}">${app.status}</span></td>
            `;
            dashboardTable.appendChild(row);
        });
    }
}

// ------------------ Employer Panel Display ------------------
let employerTable = document.getElementById("employerTable");
if(employerTable){
    let applications = JSON.parse(localStorage.getItem("applications")) || [];
    employerTable.innerHTML = "";

    applications.forEach((app,index) => {
        // Fix status class: remove spaces
        let statusClass = app.status.replace(/\s/g,'');
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${app.title}</td>
            <td>${app.company}</td>
            <td>${app.date}</td>
            <td><span class="status ${statusClass}">${app.status}</span></td>
            <td><button onclick="openModal(${index})">View</button></td>
        `;
        employerTable.appendChild(row);
    });
}

// ------------------ Modal Logic ------------------
let modal = document.getElementById("modal");
if(modal){
    document.getElementById("close-modal").onclick = () => modal.style.display = "none";

    // Close modal when clicking outside content
    window.onclick = function(event){
        if(event.target == modal){
            modal.style.display = "none";
        }
    }
}

function openModal(index){
    currentEditIndex = index;
    let applications = JSON.parse(localStorage.getItem("applications")) || [];
    document.getElementById("status-select").value = applications[index].status;
    modal.style.display = "block";
}

function saveStatus(){
    let applications = JSON.parse(localStorage.getItem("applications")) || [];
    let newStatus = document.getElementById("status-select").value;
    applications[currentEditIndex].status = newStatus;
    localStorage.setItem("applications", JSON.stringify(applications));
    modal.style.display = "none";

    // Refresh tables after status update
    location.reload();
}