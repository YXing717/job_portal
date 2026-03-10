function applyJob(title,company){

let applications = JSON.parse(localStorage.getItem("applications")) || [];

let application = {

title:title,
company:company,
date:new Date().toLocaleDateString(),
status:"Submitted"

};

applications.push(application);

localStorage.setItem("applications",JSON.stringify(applications));

alert("Application submitted!");

}



let dashboardTable = document.getElementById("applicationTable");

if(dashboardTable){

let applications = JSON.parse(localStorage.getItem("applications")) || [];

if(applications.length === 0){

dashboardTable.innerHTML =
"<tr><td colspan='4'>No applications found</td></tr>";

}else{

applications.forEach(function(app){

let row = document.createElement("tr");

row.innerHTML = `
<td>${app.title}</td>
<td>${app.company}</td>
<td>${app.date}</td>
<td>${app.status}</td>
`;

dashboardTable.appendChild(row);

});

}

}



let employerTable = document.getElementById("employerTable");

if(employerTable){

let applications = JSON.parse(localStorage.getItem("applications")) || [];

applications.forEach(function(app,index){

let row = document.createElement("tr");

row.innerHTML = `
<td>${app.title}</td>
<td>${app.company}</td>
<td>${app.date}</td>
<td>${app.status}</td>
<td>
<button onclick="updateStatus(${index},'Interview Scheduled')">Interview</button>
<button onclick="updateStatus(${index},'Rejected')">Reject</button>
</td>
`;

employerTable.appendChild(row);

});

}



function updateStatus(index,newStatus){

let applications = JSON.parse(localStorage.getItem("applications")) || [];

applications[index].status = newStatus;

localStorage.setItem("applications",JSON.stringify(applications));

location.reload();

}