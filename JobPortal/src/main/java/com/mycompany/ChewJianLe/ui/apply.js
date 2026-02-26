// ------------------------
// Mock Jobs
// ------------------------
const jobs = [
  { id: 1, title: "Software Engineer", location: "Kuala Lumpur", salary: 9000 },
  { id: 2, title: "Frontend Developer", location: "Penang", salary: 7500 },
  { id: 3, title: "Backend Developer", location: "Johor", salary: 8000 }
];

// ------------------------
// Store applied jobs globally
// ------------------------
let applications = JSON.parse(localStorage.getItem('applications')) || [];

// ------------------------
// Profile saving function
// ------------------------
function saveProfile() {
  const profile = {
    name: document.getElementById('name')?.value.trim(),
    email: document.getElementById('email')?.value.trim(),
    skills: document.getElementById('skills')?.value
      .split(',')
      .map(s => s.trim())
      .filter(s => s),
    experience: parseInt(document.getElementById('experience')?.value)
  };

  if (!profile.name || !profile.email) {
    showMessage("Please fill in required fields.", "error");
    return;
  }

  localStorage.setItem('profile', JSON.stringify(profile));
  showMessage("Profile saved successfully!", "success");
}

// ------------------------
// Render jobs
// ------------------------
// ------------------------
// Render jobs
// ------------------------
function renderJobs() {
  const results = document.getElementById('results');
  if (!results) return;

  results.innerHTML = '';

  const profile = JSON.parse(localStorage.getItem('profile'));

  jobs.forEach(job => {
    const alreadyApplied = profile &&
      applications.some(a => a.jobId === job.id && a.email === profile.email);

    const div = document.createElement('div');
    div.className = 'job-card';

    div.innerHTML = `
      <div>
        <b>${job.title}</b><br>
        ${job.location} &bull; RM${job.salary}
      </div>
      <button class="apply-btn" ${alreadyApplied ? "disabled" : ""}>
        ${alreadyApplied ? "Applied" : "Apply Now"}
      </button>
    `;

    const applyBtn = div.querySelector(".apply-btn");

    // Unified handling
    applyBtn.onclick = () => {
      if (alreadyApplied) {
        showMessage("You have already applied for this job.", "error");
        applyBtn.disabled = true; // ensure button stays disabled
        applyBtn.textContent = "Applied";
        return;
      }
      applyJob(job);
    };

    results.appendChild(div);
  });

  renderDashboard();
}

// ------------------------
// Apply job
// ------------------------
function applyJob(job) {
  const profile = JSON.parse(localStorage.getItem('profile'));
  if (!profile || !profile.name || !profile.email || !profile.skills?.length || !profile.experience) {
    showMessage("Please complete your profile before applying.", "error");
    return;
  }

  // Check for duplicates just in case
  if (applications.some(a => a.jobId === job.id && a.email === profile.email)) {
    showMessage("You have already applied for this job.", "error");
    renderJobs(); // re-render to ensure button stays disabled
    return;
  }

  const status = Math.random() < 0.1 ? "Pending Review" : "Submitted";

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
    status === "Pending Review"
      ? "System error occurred. Saved as Pending Review."
      : "Application submitted successfully!",
    status === "Pending Review" ? "error" : "success"
  );

  renderJobs(); // Re-render to disable the button immediately
}

// ------------------------
// Unapply job
// ------------------------
function unapplyJob(jobId) {
  const profile = JSON.parse(localStorage.getItem('profile'));
  applications = applications.filter(app => !(app.jobId === jobId && app.email === profile.email));
  localStorage.setItem("applications", JSON.stringify(applications));
  showMessage("Application withdrawn successfully.", "success");
  renderJobs();
}

// ------------------------
// Render applicant dashboard
// ------------------------
function renderDashboard() {
  const list = document.getElementById("appliedJobs");
  if (!list) return;

  list.innerHTML = '';

  const profile = JSON.parse(localStorage.getItem('profile'));
  if (!profile) return;

  applications
    .filter(app => app.email === profile.email)
    .forEach(app => {
      const li = document.createElement("li");
      li.style.display = "flex";
      li.style.justifyContent = "space-between";
      li.style.alignItems = "center";
      li.style.marginBottom = "5px";

      const span = document.createElement("span");
      span.textContent = `${app.title} - ${app.status}`;
      li.appendChild(span);

      const btn = document.createElement("button");
      btn.textContent = "Unapply";
      btn.onclick = () => unapplyJob(app.jobId);
      li.appendChild(btn);

      list.appendChild(li);
    });
}

// ------------------------
// Render employer view
// ------------------------
function renderEmployer() {
  const container = document.getElementById("employerView");
  if (!container) return;

  container.innerHTML = '';

  // Group applications by jobId
  const grouped = {};
  applications.forEach(app => {
    if (!grouped[app.jobId]) grouped[app.jobId] = [];
    grouped[app.jobId].push(app);
  });

  for (let jobId in grouped) {
    // Find job title from the jobs array
    const job = jobs.find(j => j.id == jobId);
    const jobTitle = job ? job.title : "Unknown Job";

    const section = document.createElement("div");
    section.innerHTML = `<h3>Job ID ${jobId} - ${jobTitle}</h3>`;

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
// Message display
// ------------------------
function showMessage(msg, type) {
  const message = document.getElementById("message");
  if (!message) return;
  message.textContent = msg;
  message.className = type;
}

// ------------------------
// Initialize
// ------------------------
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("results")) renderJobs();
  if (document.getElementById("employerView")) renderEmployer();
});