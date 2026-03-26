// This file provides profile-based job recommendation UI and interactions.
// It uses JOBS (global) from jobportal.js.

const profileHint = document.getElementById('profileHint');
const recommendationList = document.getElementById('recommendationList');
const recommendationStatus = document.getElementById('recommendationStatus');

const skillInput = document.getElementById('skillInput');
const prevJobInput = document.getElementById('prevJobInput');
const experienceSelect = document.getElementById('experienceSelect');
const locationSelect = document.getElementById('locationSelect');
const minSalaryInput = document.getElementById('minSalary');
const maxSalaryInput = document.getElementById('maxSalary');
const recommendBtn = document.getElementById('recommendBtn');
const resetBtn = document.getElementById('resetBtn');

const modal = document.getElementById('detailModal');
const modalTitle = document.getElementById('modalTitle');
const modalMeta = document.getElementById('modalMeta');
const modalDescription = document.getElementById('modalDescription');
const modalClose = document.getElementById('modalClose');

let dismissedJobs = new Set();
const PROFILE_STORAGE_KEY = 'jobportal_recommended_profile';

const EXPERIENCE_RANK = { junior: 0, mid:1, senior:2 };

function loadProfileFromStorage(){
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if(!raw) return null;
    const parsed = JSON.parse(raw);
    if(parsed && typeof parsed === 'object') return parsed;
  } catch(e){ }
  return null;
}

function saveProfileToStorage(profile){
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

function setFormFromProfile(profile){
  if(!profile) return;
  skillInput.value = Array.isArray(profile.skills) ? profile.skills.join(', ') : '';
  prevJobInput.value = Array.isArray(profile.previousJobs) ? profile.previousJobs.join(', ') : '';
  experienceSelect.value = profile.experience || 'mid';
  locationSelect.value = profile.location || '';
  minSalaryInput.value = profile.minSalary || '';
  maxSalaryInput.value = profile.maxSalary || '';
}

function normalizeText(s){
  if(!s) return '';
  s = s.toString();
  return s.normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^\p{L}\p{N} ]+/gu, ' ')
    .toLowerCase()
    .trim()
    .replace(/\s+/g,' ');
}

function getJobExperienceRank(title){
  const t = normalizeText(title);
  if(/director|chief|vp|head/.test(t)) return 3;
  if(/manager/.test(t)) return 2;
  if(/senior|lead|principal|staff/.test(t)) return 2;
  if(/mid/.test(t)) return 1;
  return 0;
}

function isExperienceCompatible(userLevel, title){
  const userRank = EXPERIENCE_RANK[userLevel] ?? 1;
  const jobRank = getJobExperienceRank(title);
  if(userRank === EXPERIENCE_RANK.junior){
    return jobRank <= 1; // no senior/director
  }
  if(userRank === EXPERIENCE_RANK.mid){
    return jobRank <= 2; // no director
  }
  return true; // senior sees all
}

function parseCommaList(raw){
  if(!raw) return [];
  return raw.split(',').map(item=>normalizeText(item)).filter(Boolean);
}

function getKeywordsFromJob(job){
  const base = `${job.title} ${job.location} ${job.description || ''}`;
  return normalizeText(base);
}

function getUserProfile(){
  const skills = parseCommaList(skillInput.value);
  const previousJobs = parseCommaList(prevJobInput.value);
  const location = locationSelect.value || '';
  const minSalary = Number(minSalaryInput.value || 0);
  const maxSalary = Number(maxSalaryInput.value || 0);
  const experience = experienceSelect.value || 'mid';

  return {
    skills,
    previousJobs,
    location,
    minSalary: minSalary > 0 ? minSalary : null,
    maxSalary: maxSalary > 0 ? maxSalary : null,
    experience
  };
}

function isProfileEligible(profile){
  return profile.skills.length > 0 || profile.previousJobs.length > 0;
}

function getRecommendationReasons(job, profile){
  const reasons = [];
  const jobText = getKeywordsFromJob(job);

  if(profile.location){
    if(normalizeText(profile.location) === normalizeText(job.location)){
      reasons.push('Location matches preference');
    } else {
      reasons.push(`Location differs: pref ${profile.location}`);
    }
  }

  const salaryFits = profile.minSalary !== null && profile.maxSalary !== null && job.salary >= profile.minSalary && job.salary <= profile.maxSalary;
  const salaryHigh = profile.minSalary !== null && job.salary >= profile.minSalary;
  const salaryLow = profile.maxSalary !== null && job.salary <= profile.maxSalary;

  if(salaryFits){
    reasons.push(`Salary RM${job.salary.toLocaleString()} fits your range RM${profile.minSalary}-${profile.maxSalary}`);
  } else {
    if(salaryHigh){
      reasons.push(`Salary RM${job.salary.toLocaleString()} above min RM${profile.minSalary}`);
    }
    if(salaryLow){
      reasons.push(`Salary RM${job.salary.toLocaleString()} below max RM${profile.maxSalary}`);
    }
  }

  const matchingSkills = profile.skills.filter(skill => jobText.includes(normalizeText(skill)));
  if(matchingSkills.length){
    reasons.push(`Skill alignment: ${matchingSkills.join(', ')}`);
  }

  const matchingPrev = profile.previousJobs.filter(prev => jobText.includes(normalizeText(prev)));
  if(matchingPrev.length){
    reasons.push(`Relevant to your history: ${matchingPrev.join(', ')}`);
  }

  if(reasons.length === 0){
    reasons.push('Role is a strong fit based on your experience level');
  }

  const level = getJobExperienceRank(job.title);
  if(level >= 2 && profile.experience === 'junior'){
    reasons.push('Filtered to avoid senior roles for junior experience');
  }

  return reasons;
}

function recommendJobs(profile){
  if(!isProfileEligible(profile)) return [];

  const filtered = JOBS.filter(job => {
    if(!isExperienceCompatible(profile.experience, job.title)) return false;

    if(profile.location && normalizeText(profile.location) !== normalizeText(job.location)) return false;

    if(profile.minSalary !== null && job.salary < profile.minSalary) return false;
    if(profile.maxSalary !== null && job.salary > profile.maxSalary) return false;

    if(profile.skills.length > 0){
      const jobText = getKeywordsFromJob(job);
      const hasSkillMatch = profile.skills.some(skill => jobText.includes(normalizeText(skill)));
      if(!hasSkillMatch) return false;
    }

    return true;
  });

  if(filtered.length >= 5){
    return filtered.slice(0, 10);
  }

  // If not enough matches, add compatible fallback roles (still no senior if junior, etc.)
  const fallback = JOBS.filter(job => !filtered.includes(job) && isExperienceCompatible(profile.experience, job.title));
  return [...filtered, ...fallback].slice(0, 10);
}

function showSnackbar(msg, type='success'){
  let sn = document.getElementById('snackbar');
  if(!sn){
    sn = document.createElement('div');
    sn.id='snackbar';
    sn.className='snackbar';
    document.body.appendChild(sn);
  }
  sn.textContent = msg;
  sn.className = `snackbar show ${type}`;
  setTimeout(()=>{ sn.className = 'snackbar'; }, 2800);
}

function renderRecommendations(){
  const profile = getUserProfile();
  recommendationList.innerHTML = '';

  if(!isProfileEligible(profile)){
    profileHint.textContent = 'No recommended jobs: add at least one skill or previous job title.';
    recommendationStatus.textContent = 'No recommendations - profile requirements not met.';
    return;
  }

  const recs = recommendJobs(profile).filter(job => !dismissedJobs.has(`${normalizeText(job.title)}|${normalizeText(job.location)}|${job.salary}`));

  if(recs.length === 0){
    recommendationStatus.textContent = 'No matching jobs found after filtering. Try loosening your preferences.';
    recommendationList.innerHTML = '<div class="job-card no-results"><div class="no-results-emoji">🔍</div><div class="no-results-text">No recommended jobs at the moment. Please update your profile preferences.</div></div>';
    return;
  }

  recommendationStatus.textContent = `Showing ${recs.length} recommended job${recs.length === 1 ? '' : 's'} (top matches)`;
  profileHint.textContent = 'Tap on a card for full job details. Use the × to remove cards from view.';

  recs.forEach(job => {
    const card = document.createElement('div');
    card.className = 'job-card';

    const left = document.createElement('div');
    left.className = 'job-left';

    const icon = document.createElement('div');
    icon.className = 'job-icon';
    icon.textContent = '✨';

    const title = document.createElement('div');
    title.className = 'job-title';
    title.textContent = job.title;

    const meta = document.createElement('div');
    meta.className = 'job-meta';
    meta.textContent = `${job.company || 'Unknown Company'} • ${job.location} • RM${job.salary.toLocaleString()}`;

    const reasonList = document.createElement('div');
    reasonList.className = 'job-tags';
    const reasons = getRecommendationReasons(job, profile);
    reasonList.innerHTML = `<strong>Why recommended:</strong> ${reasons.slice(0,3).join(' · ')}`;

    left.appendChild(icon);
    left.appendChild(title);
    left.appendChild(meta);
    left.appendChild(reasonList);

    const right = document.createElement('div');
    right.className = 'job-right';

    const dismissBtn = document.createElement('button');
    dismissBtn.className = 'btn remove';
    dismissBtn.textContent = '×';
    dismissBtn.title = 'Dismiss this recommendation';
    dismissBtn.addEventListener('click', e => {
      e.stopPropagation();
      const key = `${normalizeText(job.title)}|${normalizeText(job.location)}|${job.salary}`;
      dismissedJobs.add(key);
      showSnackbar('Recommendation dismissed', 'info');
      renderRecommendations();
    });

    right.appendChild(dismissBtn);

    card.appendChild(left);
    card.appendChild(right);

    card.addEventListener('click', () => {
      openModal(job);
    });

    recommendationList.appendChild(card);
  });
}

function populateLocationOptions(){
  const locations = Array.from(new Set(JOBS.map(job => job.location))).sort();
  locations.forEach(loc => {
    const opt = document.createElement('option');
    opt.value = loc;
    opt.textContent = loc;
    locationSelect.appendChild(opt);
  });
}

function openModal(job){
  modalTitle.textContent = job.title;
  modalMeta.textContent = `${job.location} • RM${job.salary.toLocaleString()}`;
  const html = (job.description || 'No description available')
    .replace(/\n/g,'<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  modalDescription.innerHTML = html;
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal(){
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
}

if(modalClose){
  modalClose.addEventListener('click', closeModal);
}
if(modal){
  modal.addEventListener('click', e => { if(e.target === modal) closeModal(); });
}

recommendBtn.addEventListener('click', () => {
  const profile = getUserProfile();
  saveProfileToStorage(profile);
  renderRecommendations();
});
resetBtn.addEventListener('click', () => {
  localStorage.removeItem(PROFILE_STORAGE_KEY);
  skillInput.value = '';
  prevJobInput.value = '';
  experienceSelect.value = 'mid';
  locationSelect.value = '';
  minSalaryInput.value = '';
  maxSalaryInput.value = '';
  dismissedJobs.clear();
  recommendationList.innerHTML = '';
  recommendationStatus.textContent = 'Profile reset. Add skills or titles and click show recommendations.';
  profileHint.textContent = 'Need at least one skill or previous job title to generate recommendations.';
});

window.addEventListener('DOMContentLoaded', () => {
  populateLocationOptions();
  const storedProfile = loadProfileFromStorage();
  if(storedProfile){
    setFormFromProfile(storedProfile);
    recommendationStatus.textContent = 'Loaded saved profile. Click Show recommendations to refresh.';
  } else {
    recommendationStatus.textContent = 'Fill in your profile to start recommendations.';
  }
});
