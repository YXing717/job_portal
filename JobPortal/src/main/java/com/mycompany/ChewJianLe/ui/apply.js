// ------------------------
// Temporary profile and applications
// ------------------------
let tempProfile = {
  name: '',
  email: '',
  skills: [],
  experience: 0
};

let applications = [];

// ------------------------
// Mock job data
// ------------------------
const jobs = [
  {"id":1,"title":"Software Engineer","location":"Kuala Lumpur","salary":9000},
  {"id":2,"title":"QA Engineer","location":"Ipoh","salary":6800},
  {"id":3,"title":"Data Scientist","location":"Cyberjaya","salary":7800},
  {"id":4,"title":"UX Designer","location":"Kuala Lumpur","salary":5500},
  {"id":5,"title":"Frontend Developer","location":"Shah Alam","salary":5600}
];

// ------------------------
// Save temporary profile
// ------------------------
function saveProfile() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const skills = document.getElementById('skills').value
                   .split(',')
                   .map(s => s.trim())
                   .filter(s => s);
  const experience = parseInt(document.getElementById('experience').value);

  tempProfile.name = name;
  tempProfile.email = email;
  tempProfile.skills = skills;
  tempProfile.experience = experience;

  showMessage('Profile saved successfully!', 'success');
  console.log('Temporary profile:', tempProfile);
}

// ------------------------
// Show messages
// ------------------------
function showMessage(msg, type='success') {
  const messageEl = document.getElementById('message');
  messageEl.textContent = msg;
  messageEl.className = type === 'success' ? 'success' : 'error';
  messageEl.style.display = 'block';
  setTimeout(() => messageEl.style.display='none', 3000);
}

// ------------------------
// Render jobs
// ------------------------
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

// ------------------------
// Apply Now logic
// ------------------------
function applyJob(job, btn) {
  const profile = tempProfile;

  // Scenario 2: Incomplete profile
  if(!profile.name || !profile.email || !profile.skills.length || !profile.experience){
    showMessage('Please complete your profile before applying.', 'error');
    return;
  }

  // Scenario 3: Duplicate application
  if(applications.some(a => a.jobId === job.id && a.email === profile.email)){
    showMessage('You have already applied for this job.', 'error');
    return;
  }

  // Scenario 6: Simulate system error (10% chance)
  const simulatedError = Math.random() < 0.1;
  const status = simulatedError ? 'Pending Review' : 'Submitted';

  const app = { jobId: job.id, title: job.title, email: profile.email, status };
  applications.push(app);

  showMessage(simulatedError ? 
              'System error occurred. Your application is saved as Pending Review.' : 
              'Application submitted successfully!', 
              simulatedError ? 'error' : 'success');

  // Update dashboard
  const dashboard = document.getElementById('appliedJobs');
  const li = document.createElement('li');
  li.innerHTML = `${job.title} <span class="status">${app.status}</span>`;
  dashboard.appendChild(li);

  // Update button
  btn.textContent = 'Applied';
  btn.disabled = true;

  // -------------------------
  // Employer view (Scenario 5)
  // -------------------------
  const employerView = document.getElementById('employerView');

  // Create job section if not exists
  let jobSection = document.getElementById(`job-${job.id}`);
  if(!jobSection){
    jobSection = document.createElement('div');
    jobSection.id = `job-${job.id}`;
    jobSection.innerHTML = `<h4>${job.title} Applicants:</h4><ul id="appList-${job.id}"></ul>`;
    employerView.appendChild(jobSection);
  }

  // Add applicant to job
  const appList = document.getElementById(`appList-${job.id}`);
  const liEmp = document.createElement('li');
  liEmp.textContent = `${profile.name} (${app.status})`;
  appList.appendChild(liEmp);
}

// ------------------------
// Render jobs on page load
// ------------------------
renderResults(jobs);