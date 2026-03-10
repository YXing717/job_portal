let applications = [

{
title:"Frontend Developer",
company:"ABC Company",
date:"10 March 2026",
status:"Submitted"
},

{
title:"Backend Developer",
company:"XYZ Tech",
date:"8 March 2026",
status:"Pending Review"
}

];

const table = document.getElementById("applicationTable");

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