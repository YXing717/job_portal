let applications = JSON.parse(localStorage.getItem("applications")) || [];

const table = document.getElementById("applicationTable");

if(applications.length === 0){

table.innerHTML =
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

table.appendChild(row);

});

}