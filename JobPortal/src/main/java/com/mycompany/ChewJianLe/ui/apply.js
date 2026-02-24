// --- Mock Data ---
let data = {
  "userProfile": {
    "name": "Chew Jian Le",
    "email": "jianle@example.com",
    "skills": ["Java", "React", "SQL"],
    "experience": 3
  },
  "applications": [],
  "jobs": [
    {"id":1,"title":"Software Engineer","location":"Kuala Lumpur","salary":9000},
    {"id":2,"title":"QA Engineer","location":"Ipoh","salary":6800},
    {"id":3,"title":"Data Scientist","location":"Cyberjaya","salary":7800},
    {"id":4,"title":"UX Designer","location":"Kuala Lumpur","salary":5500},
    {"id":5,"title":"Frontend Developer","location":"Shah Alam","salary":5600}
  ]
};

// --- Variables ---
let userProfile = data.userProfile;
let applications = data.applications;
let jobs = data.jobs;

// --- Render jobs immediately ---
renderResults(jobs);

// --- Show messages ---
function showMessage(msg, type='success') {
  const messageEl = document.getElementById('message');
  messageEl.textContent = msg;
  messageEl.className = type === 'success' ? 'success' : 'error';
  messageEl.style.display = 'block';
  setTimeout(() => messageEl.style.display='none', 3000);
}

// --- Render job cards ---
function renderResults(jobs) {
  const resultsEl = document.getElementById('results');
  resultsEl.innerHTML = '';
  jobs.forEach(job => {
    const card = document.createElement('div');
    card.className = 'job-card';
    card.innerHTML = `
      <div class="job-info">
        <div class="job-title">${job.title}</div>
        <div class="job-meta">${job.location} • RM${job.salary}</div>
      </div>
      <button class="apply-btn">Apply Now</button>
    `;
    const btn = card.querySelector('.apply-btn');
    btn.addEventListener('click', () => applyJob(job, btn));
    resultsEl.appendChild(card);
  });
}

// --- Apply Now logic ---
function applyJob(job, btn) {
  if(!userProfile.name || !userProfile.email || !userProfile.skills.length || !userProfile.experience){
    showMessage('Please complete your profile before applying.', 'error');
    return;
  }

  if(applications.some(a => a.jobId === job.id && a.email === userProfile.email)){
    showMessage('You have already applied for this job.', 'error');
    return;
  }

  const app = { jobId: job.id, title: job.title, email: userProfile.email, status: 'Submitted' };
  applications.push(app);
  showMessage('Application submitted successfully!', 'success');

  const dashboard = document.getElementById('appliedJobs');
  const li = document.createElement('li');
  li.innerHTML = `${job.title} <span class="status">${app.status}</span>`;
  dashboard.appendChild(li);

  btn.textContent = 'Applied';
  btn.disabled = true;
}