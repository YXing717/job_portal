// ------------------------
// Mock Jobs
// ------------------------
const jobs = [
  {id:1,title:"Software Engineer",location:"Kuala Lumpur",salary:9000},
  {id:2,title:"QA Engineer",location:"Ipoh",salary:6800},
  {id:3,title:"Data Scientist",location:"Cyberjaya",salary:7800}
];

// ------------------------
// Get stored data
// ------------------------
let applications = JSON.parse(localStorage.getItem('applications')) || [];

// ------------------------
// Detect current page
// ------------------------
document.addEventListener("DOMContentLoaded", () => {
  const page = window.location.pathname;

  if(page.includes("jobs.html")){
    renderJobs();
  }

  if(page.includes("employer.html")){
    renderEmployer();
  }
});

// ------------------------
// PROFILE PAGE
// ------------------------
function saveProfile() {
  const profile = {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    skills: document.getElementById('skills').value
            .split(',')
            .map(s => s.trim())
            .filter(s => s),
    experience: parseInt(document.getElementById('experience').value)
  };

  localStorage.setItem('profile', JSON.stringify(profile));
  showMessage("Profile saved successfully!", "success");
}

// ------------------------
// JOB PAGE
// ------------------------
function renderJobs() {
  const results = document.getElementById('results');
  if(!results) return;

  results.innerHTML = '';

  jobs.forEach(job => {

    const alreadyApplied = applications.some(a => a.jobId === job.id);

    const div = document.createElement('div');
    div.className = 'job-card';

    div.innerHTML = `
      <div>
        <b>${job.title}</b><br>
        ${job.location} • RM${job.salary}
      </div>
      <button ${alreadyApplied ? "disabled" : ""}>
        ${alreadyApplied ? "Applied" : "Apply Now"}
      </button>
    `;

    const btn = div.querySelector("button");
    btn.onclick = () => applyJob(job);

    results.appendChild(div);
  });

  renderDashboard();
}

function applyJob(job) {
  const profile = JSON.parse(localStorage.getItem('profile'));

  // Scenario 2
  if(!profile || !profile.name || !profile.email || !profile.skills?.length || !profile.experience){
    showMessage("Please complete your profile before applying.", "error");
    return;
  }

  // Scenario 3
  if(applications.some(a => a.jobId === job.id && a.email === profile.email)){
    showMessage("You have already applied for this job.", "error");
    return;
  }

  // Scenario 6 (simulate error)
  const simulatedError = Math.random() < 0.1;
  const status = simulatedError ? "Pending Review" : "Submitted";

  const newApp = {
    jobId: job.id,
    title: job.title,
    name: profile.name,
    email: profile.email,
    status: status
  };

  applications.push(newApp);
  localStorage.setItem("applications", JSON.stringify(applications));

  showMessage(
    simulatedError
      ? "System error occurred. Saved as Pending Review."
      : "Application submitted successfully!",
    simulatedError ? "error" : "success"
  );

  renderJobs();
}

function renderDashboard(){
  const list = document.getElementById("appliedJobs");
  if(!list) return;

  list.innerHTML = '';

  applications.forEach(app => {
    const li = document.createElement("li");
    li.textContent = `${app.title} - ${app.status}`;
    list.appendChild(li);
  });
}

// ------------------------
// EMPLOYER PAGE
// ------------------------
function renderEmployer(){
  const container = document.getElementById("employerView");
  if(!container) return;

  container.innerHTML = '';

  const grouped = {};

  applications.forEach(app => {
    if(!grouped[app.jobId]){
      grouped[app.jobId] = [];
    }
    grouped[app.jobId].push(app);
  });

  for(let jobId in grouped){
    const section = document.createElement("div");
    section.innerHTML = `<h3>Job ID ${jobId}</h3>`;

    const ul = document.createElement("ul");

    grouped[jobId].forEach(app => {
      const li = document.createElement("li");
      li.textContent = `${app.name} - ${app.status}`;
      ul.appendChild(li);
    });

    section.appendChild(ul);
    container.appendChild(section);
  }
}

// ------------------------
// Message
// ------------------------
function showMessage(msg, type){
  const message = document.getElementById("message");
  if(!message) return;

  message.textContent = msg;
  message.className = type;
}