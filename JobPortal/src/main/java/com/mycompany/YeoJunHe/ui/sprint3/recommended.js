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

// (Modal elements already declared globally in jobportal.js)





let dismissedJobs = new Set();
const PROFILE_STORAGE_KEY = 'jobportal_recommended_profile';

const EXPERIENCE_RANK = { junior: 0, senior: 1, director: 2 };

function loadProfileFromStorage() {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') return parsed;
  } catch (e) { }
  return null;
}

function saveProfileToStorage(profile) {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

function setFormFromProfile(profile) {
  if (!profile) return;
  if (skillInput) skillInput.value = Array.isArray(profile.skills) ? profile.skills.join(', ') : '';
  if (prevJobInput) prevJobInput.value = Array.isArray(profile.previousJobs) ? profile.previousJobs.join(', ') : '';
  if (experienceSelect) experienceSelect.value = profile.experience || 'Junior';
  if (locationSelect) locationSelect.value = profile.location || '';
  if (minSalaryInput) minSalaryInput.value = profile.minSalary || '';
  if (maxSalaryInput) maxSalaryInput.value = profile.maxSalary || '';
}

function normalizeText(s) {
  if (!s) return '';
  s = s.toString();
  return s.normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^\p{L}\p{N} ]+/gu, ' ')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

function getJobExperienceRank(title) {
  const t = normalizeText(title);
  if (/director|chief|vp|head/.test(t)) return 2;
  if (/senior|lead|principal|staff/.test(t)) return 1;


  return 0;
}

function isExperienceCompatible(userLevel, title) {
  const userRank = EXPERIENCE_RANK[normalizeText(userLevel)] ?? 0;
  const jobRank = getJobExperienceRank(title);
  return jobRank <= userRank;






}

function parseCommaList(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map(item => normalizeText(item)).filter(Boolean);
  return String(raw).split(',').map(item => normalizeText(item)).filter(Boolean);
}

function getMainUserProfile() {
  try {
    const raw = localStorage.getItem('userProfile');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function applyMainUserProfile(profile) {
  if (!profile) return;
  if (profile.skills && skillInput) skillInput.value = Array.isArray(profile.skills) ? profile.skills.join(', ') : profile.skills;
  if (profile.jobRole && prevJobInput) prevJobInput.value = profile.jobRole;
  if (profile.location && locationSelect) locationSelect.value = profile.location;
  if (profile.experience && experienceSelect) experienceSelect.value = profile.experience;
  if (profile.salaryRange) {
    const m = profile.salaryRange.match(/(\d+)\s*[-–]\s*(\d+)/);
    if (m) {
      if (minSalaryInput) minSalaryInput.value = m[1];
      if (maxSalaryInput) maxSalaryInput.value = m[2];
    }
  }
}

function buildRecommendationProfileFromMainUser() {
  const user = getMainUserProfile();
  if (!user) return null;

  const skills = parseCommaList(user.skills || (Array.isArray(user.skills) ? user.skills.join(', ') : ''));
  const previousJobs = parseCommaList(user.jobRole || '');
  const location = user.location || '';
  let minSalary = null;
  let maxSalary = null;

  if (user.salaryRange) {
    const m = user.salaryRange.toString().match(/(\d+)\s*[-–]\s*(\d+)/);
    if (m) {
      minSalary = Number(m[1]);
      maxSalary = Number(m[2]);
    }
  }

  return {
    skills,
    previousJobs,
    location,
    minSalary: minSalary > 0 ? minSalary : null,
    maxSalary: maxSalary > 0 ? maxSalary : null,
    experience: user.experience || 'Junior'
  };
}

function getKeywordsFromJob(job) {
  const base = `${job.title} ${job.location} ${job.description || ''}`;
  return normalizeText(base);
}

function getUserProfile() {
  const localProfile = buildRecommendationProfileFromMainUser();
  const skills = parseCommaList(skillInput?.value || '');
  const previousJobs = parseCommaList(prevJobInput?.value || '');
  const location = locationSelect?.value || '';
  const minSalary = Number(minSalaryInput?.value || 0);
  const maxSalary = Number(maxSalaryInput?.value || 0);
  const experience = experienceSelect?.value || 'Junior';

  const inputProfile = {
    skills,
    previousJobs,
    location,
    minSalary: minSalary > 0 ? minSalary : null,
    maxSalary: maxSalary > 0 ? maxSalary : null,
    experience
  };

  if (isProfileEligible(inputProfile)) return inputProfile;
  if (localProfile && isProfileEligible(localProfile)) return localProfile;
  return inputProfile;
}

function isProfileEligible(profile) {
  return profile.skills.length > 0 || profile.previousJobs.length > 0;
}

function getRecommendationReasons(job, profile) {
  const reasons = [];
  const jobText = getKeywordsFromJob(job);

  if (profile.location) {
    if (normalizeText(profile.location) === normalizeText(job.location)) {
      reasons.push('Location matches preference');
    } else {
      reasons.push(`Location differs: pref ${profile.location}`);
    }
  }

  const salaryFits = profile.minSalary !== null && profile.maxSalary !== null && job.salary >= profile.minSalary && job.salary <= profile.maxSalary;
  const salaryHigh = profile.minSalary !== null && job.salary >= profile.minSalary;
  const salaryLow = profile.maxSalary !== null && job.salary <= profile.maxSalary;

  if (salaryFits) {
    reasons.push(`Salary RM${job.salary.toLocaleString()} fits your range RM${profile.minSalary}-${profile.maxSalary}`);
  } else {
    if (salaryHigh) {
      reasons.push(`Salary RM${job.salary.toLocaleString()} above min RM${profile.minSalary}`);
    }
    if (salaryLow) {
      reasons.push(`Salary RM${job.salary.toLocaleString()} below max RM${profile.maxSalary}`);
    }
  }

  const matchingSkills = profile.skills.filter(skill => jobText.includes(normalizeText(skill)));
  if (matchingSkills.length) {
    reasons.push(`Skill alignment: ${matchingSkills.join(', ')}`);
  }

  const matchingPrev = profile.previousJobs.filter(prev => jobText.includes(normalizeText(prev)));
  if (matchingPrev.length) {
    reasons.push(`Relevant to your history: ${matchingPrev.join(', ')}`);
  }

  if (reasons.length === 0) {
    reasons.push('Role is a strong fit based on your experience level');
  }

  const level = getJobExperienceRank(job.title);
  if (level >= 2 && profile.experience === 'junior') {
    reasons.push('Filtered to avoid senior roles for junior experience');
  }

  return reasons;
}

function recommendJobs(profile) {
  if (!isProfileEligible(profile)) return [];

  const filtered = JOBS.filter(job => {
    if (!isExperienceCompatible(profile.experience, job.title)) return false;

    if (profile.location && normalizeText(profile.location) !== normalizeText(job.location)) return false;

    if (profile.minSalary !== null && job.salary < profile.minSalary) return false;
    if (profile.maxSalary !== null && job.salary > profile.maxSalary) return false;

    if (profile.skills.length > 0) {
      // match against job's defined required skills first
      const jobSkills = (job.requiredSkills || []).map(s => normalizeText(s));
      const userSkills = profile.skills.map(s => normalizeText(s));
      const skillMatch = userSkills.some(us => jobSkills.some(js => js.includes(us) || us.includes(js)));
      if (!skillMatch) {
        // fallback to description search when explicit keywords not defined
        const jobText = getKeywordsFromJob(job);
        const textMatch = userSkills.some(us => jobText.includes(us));
        if (!textMatch) return false;
      }
    }

    return true;
  });

  if (filtered.length > 0) {
    return filtered; // show all matched results
  }

  // If no exact matches, return compatible fallback roles (still no senior if junior, etc.)
  return JOBS.filter(job => isExperienceCompatible(profile.experience, job.title));

}

function showSnackbar(msg, type = 'success') {
  let sn = document.getElementById('snackbar');
  if (!sn) {
    sn = document.createElement('div');
    sn.id = 'snackbar';
    sn.className = 'snackbar';
    document.body.appendChild(sn);
  }
  sn.textContent = msg;
  sn.className = `snackbar show ${type}`;
  setTimeout(() => { sn.className = 'snackbar'; }, 2800);
}

function renderRecommendations() {
  const userProfile = getMainUserProfile();
  recommendationList.innerHTML = '';

  if (!userProfile) {
    recommendationStatus.textContent = 'No user profile found. Please set up your profile first.';
    recommendationList.innerHTML = '<div class="job-card no-results"><div class="no-results-emoji">⚠️</div><div class="no-results-text">No profile data available. Go to profile page to add your information.</div></div>';
    return;
  }

  // Parse user profile
  const userSkills = parseCommaList(userProfile.skills || '');
  const userLocation = userProfile.location || '';
  const userExperience = userProfile.experience || 'mid';
  let minSalary = null, maxSalary = null;
  if (userProfile.salaryRange) {
    const m = userProfile.salaryRange.match(/(\d+)\s*[-–]\s*(\d+)/);
    if (m) {
      minSalary = Number(m[1]);
      maxSalary = Number(m[2]);
    }
  }

  // Filter jobs dynamically based on primary filter
  const filterMode = document.getElementById('primaryFilter') ? document.getElementById('primaryFilter').value : 'best';

  const matchedJobs = JOBS.filter(job => {
    const salaryMatch = (minSalary === null || job.salary >= minSalary) && (maxSalary === null || job.salary <= maxSalary);

    let skillMatch = false;
    if (userSkills.length > 0) {
      const jobSkills = (job.requiredSkills || []).map(s => normalizeText(s));
      skillMatch = userSkills.some(us => jobSkills.some(js => js.includes(normalizeText(us)) || normalizeText(us).includes(js)));
      if (!skillMatch) {
        const jobText = getKeywordsFromJob(job);
        skillMatch = userSkills.some(us => jobText.includes(normalizeText(us)));
      }
    } else {
      skillMatch = true;
    }

    const locationMatch = !userLocation || normalizeText(userLocation) === normalizeText(job.location);
    const expMatch = isExperienceCompatible(userExperience, job.title);

    const userRoles = parseCommaList(userProfile.previousJobs || userProfile.jobRole || '');
    let roleMatch = false;
    if (userRoles.length > 0) {
      const titleNorm = normalizeText(job.title);
      roleMatch = userRoles.some(r => titleNorm.includes(normalizeText(r)) || normalizeText(r).includes(titleNorm));
    } else {
      roleMatch = true;
    }

    let isMatch = true;
    if (filterMode === 'skills') {
      isMatch = userSkills.length === 0 ? true : skillMatch;
    } else if (filterMode === 'location') {
      isMatch = locationMatch;
    } else if (filterMode === 'role') {
      isMatch = userRoles.length === 0 ? true : roleMatch;
    } else {
      isMatch = skillMatch && locationMatch && expMatch && salaryMatch;
    }

    if (!isMatch) return false;

    // Check if dismissed
    const key = `${normalizeText(job.title)}|${normalizeText(job.location)}|${job.salary}`;
    if (dismissedJobs.has(key)) return false;

    job.mismatches = [];
    job.matches = [];

    if (userSkills.length > 0) {
      if (skillMatch) job.matches.push("Skills match");
      else job.mismatches.push("Missing required skills");
    }

    if (userLocation) {
      if (locationMatch) job.matches.push("Location match");
      else job.mismatches.push(`Not in ${userLocation}`);
    }

    if (expMatch) job.matches.push("Experience match");
    else job.mismatches.push("Experience mismatch");

    if (salaryMatch) {
      job.matches.push("Salary match");
    } else {
      if (minSalary !== null && job.salary < minSalary) job.mismatches.push(`Salary < RM${minSalary.toLocaleString()}`);
      if (maxSalary !== null && job.salary > maxSalary) job.mismatches.push(`Salary > RM${maxSalary.toLocaleString()}`);
    }

    return true;
  });

  if (matchedJobs.length === 0) {
    recommendationStatus.textContent = 'No matching jobs found based on your profile.';
    recommendationList.innerHTML = '<div class="job-card no-results"><div class="no-results-emoji">🔍</div><div class="no-results-text">No jobs match your current profile criteria. Try updating your preferences.</div></div>';
    return;
  }

  recommendationStatus.textContent = `Found ${matchedJobs.length} matching job${matchedJobs.length === 1 ? '' : 's'} based on your profile.`;


  matchedJobs.forEach(job => {
    const card = document.createElement('div');
    card.className = 'job-card';

    const left = document.createElement('div');
    left.className = 'job-left';

    const icon = document.createElement('div');
    icon.className = 'job-icon';
    icon.textContent = '💼';

    const title = document.createElement('div');
    title.className = 'job-title';
    title.textContent = job.title;

    const meta = document.createElement('div');
    meta.className = 'job-meta';
    meta.textContent = `${job.company || 'Unknown Company'} • ${job.location} • RM${job.salary.toLocaleString()}`;

    if (job.tagline) {
      const tags = document.createElement('div');
      tags.className = 'job-tags';
      tags.textContent = job.tagline;
      left.appendChild(tags);
    }

    left.appendChild(icon);
    left.appendChild(title);
    left.appendChild(meta);


    const right = document.createElement('div');
    right.className = 'job-right';
    right.style.display = 'flex';
    right.style.flexDirection = 'column';
    right.style.alignItems = 'flex-end';
    right.style.gap = '8px';

    // Dismiss button as a block at the top
    const dismissBtn = document.createElement('button');
    dismissBtn.className = 'btn remove';
    dismissBtn.textContent = '×';
    dismissBtn.style.padding = '4px 8px';
    dismissBtn.style.fontSize = '12px';
    dismissBtn.title = 'Dismiss this recommendation';
    dismissBtn.addEventListener('click', e => {
      e.stopPropagation();
      const key = `${normalizeText(job.title)}|${normalizeText(job.location)}|${job.salary}`;
      dismissedJobs.add(key);
      showSnackbar('Recommendation dismissed', 'info');
      renderRecommendations();
    });
    right.appendChild(dismissBtn);

    if ((job.mismatches && job.mismatches.length > 0) || (job.matches && job.matches.length > 0)) {
      const mismatchContainer = document.createElement('div');
      mismatchContainer.className = 'mismatch-container';
      mismatchContainer.style.display = 'flex';
      mismatchContainer.style.flexDirection = 'column';
      mismatchContainer.style.alignItems = 'flex-end';
      mismatchContainer.style.gap = '4px';

      if (job.matches) {
        job.matches.forEach(m => {
          const badge = document.createElement('span');
          badge.className = 'match-badge';
          badge.textContent = m;
          mismatchContainer.appendChild(badge);
        });
      }

      if (job.mismatches) {
        job.mismatches.forEach(mm => {
          const badge = document.createElement('span');
          badge.className = 'mismatch-badge';
          badge.textContent = mm;
          mismatchContainer.appendChild(badge);
        });
      }

      right.appendChild(mismatchContainer);
    }

    card.appendChild(left);
    card.appendChild(right);
    card.addEventListener('click', () => openModal(job));




    recommendationList.appendChild(card);
  });
}



function populateLocationOptions() {
  if (!locationSelect) return;
  const locations = Array.from(new Set(JOBS.map(job => job.location))).sort();
  locations.forEach(loc => {
    const opt = document.createElement('option');
    opt.value = loc;
    opt.textContent = loc;
    locationSelect.appendChild(opt);
  });
}

// Modal handlers are handled by jobportal.js










function updateRecommendationsFromForm() {
  const profile = getUserProfile();
  saveProfileToStorage(profile);
  renderRecommendations();
}

const refreshRecommendationsBtn = document.getElementById('refreshRecommendationsBtn');
if (refreshRecommendationsBtn) {
  refreshRecommendationsBtn.addEventListener('click', () => {
    renderRecommendations();
    showSnackbar('Recommendations refreshed', 'success');
  });
}

const primaryFilter = document.getElementById('primaryFilter');
if (primaryFilter) {
  primaryFilter.addEventListener('change', () => {
    updateRecommendationsFromForm();
  });
}

[skillInput, prevJobInput, experienceSelect, locationSelect, minSalaryInput, maxSalaryInput].forEach(el => {
  if (el) {
    el.addEventListener('input', () => {
      updateRecommendationsFromForm();
    });
    el.addEventListener('change', () => {
      updateRecommendationsFromForm();
    });
  }








});

if (recommendBtn) {
  recommendBtn.addEventListener('click', e => {
    e.preventDefault();
    updateRecommendationsFromForm();
  });
}
if (resetBtn) {
  resetBtn.addEventListener('click', e => {
    e.preventDefault();
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    skillInput.value = '';
    prevJobInput.value = '';
    experienceSelect.value = 'Junior';
    locationSelect.value = '';
    minSalaryInput.value = '';
    maxSalaryInput.value = '';
    dismissedJobs.clear();
    recommendationStatus.textContent = 'Profile reset. Add skills or titles to see recommendations.';
    profileHint.textContent = 'Need at least one skill or previous job title to generate recommendations.';
    renderRecommendations();
  });
}

window.addEventListener('DOMContentLoaded', () => {
  populateLocationOptions();

  const storedProfile = loadProfileFromStorage();
  if (storedProfile) {
    setFormFromProfile(storedProfile);
    recommendationStatus.textContent = 'Loaded saved recommendation profile.';
  }

  const mainProfile = getMainUserProfile();
  if (mainProfile) {
    applyMainUserProfile(mainProfile);
    recommendationStatus.textContent = 'Profile data loaded automatically from your account. Showing recommendations.';
    saveProfileToStorage(getUserProfile());
  }

  // auto-run recommendations as passive behavior whenever the user opens this page
  renderRecommendations();
});

// Profile Sidebar Management
const profileToggleBtn = document.getElementById('profileToggleBtn');
const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const profileSidebar = document.getElementById('profileSidebar');
const saveProfileBtn = document.getElementById('saveProfileBtn');

function setProfileSidebar(open) {
  if (!profileSidebar || !sidebarOverlay) return;
  profileSidebar.classList.toggle('open', open);
  sidebarOverlay.classList.toggle('active', open);
  profileSidebar.setAttribute('aria-hidden', String(!open));
  if (open) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

if (profileToggleBtn) {
  profileToggleBtn.addEventListener('click', () => {
    updateProfileForm(getMainUserProfile());
    setProfileSidebar(true);
  });
}
if (sidebarCloseBtn) {
  sidebarCloseBtn.addEventListener('click', () => setProfileSidebar(false));
}
if (sidebarOverlay) {
  sidebarOverlay.addEventListener('click', () => setProfileSidebar(false));
}
if (saveProfileBtn) {
  saveProfileBtn.addEventListener('click', () => {
    const profile = {
      salaryRange: document.getElementById('salaryRange')?.value.trim() || '',
      location: document.getElementById('location')?.value.trim() || '',
      skills: document.getElementById('skills')?.value.trim() || '',
      jobRole: document.getElementById('jobRole')?.value.trim() || '',
      experience: document.getElementById('experience')?.value || ''
    };
    localStorage.setItem('userProfile', JSON.stringify(profile));
    showSnackbar('Profile saved', 'success');
    setProfileSidebar(false);

    // Auto-update recommendations panel when saved from sidebar
    renderRecommendations();
  });
}

function updateProfileForm(profile) {
  if (!profile) profile = {};
  if (document.getElementById('salaryRange')) document.getElementById('salaryRange').value = profile.salaryRange || '';
  if (document.getElementById('location')) document.getElementById('location').value = profile.location || '';
  if (document.getElementById('skills')) document.getElementById('skills').value = profile.skills || '';
  if (document.getElementById('jobRole')) document.getElementById('jobRole').value = profile.jobRole || '';
  if (document.getElementById('experience')) document.getElementById('experience').value = profile.experience || '';
}