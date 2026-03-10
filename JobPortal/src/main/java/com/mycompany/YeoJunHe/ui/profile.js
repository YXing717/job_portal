// Utilities (mirrors helpers in jobportal.js)
function normalize(s){
  if(!s) return "";
  s = s.normalize('NFD').replace(/\p{Diacritic}/gu, '');
  s = s.replace(/[^\p{L}\p{N} ]+/gu,' ');
  return s.toLowerCase().trim().replace(/\s+/g,' ');
}

function getJobKey(job){
  if(!job) return '';
  return `${normalize(job.title)}|${normalize(job.location)}|${job.salary}`;
}

function parseSavedJobsRaw(raw){
  if(!raw) return [];
  try{
    const arr = JSON.parse(raw);
    if(Array.isArray(arr)){
      return arr.map(item => {
        if(item && typeof item === 'object') return item;
        if(typeof item === 'string'){
          const parts = item.split('|');
          return {title: parts[0] || '', location: parts[1] || '', salary: parseFloat(parts[2]) || 0};
        }
        return null;
      }).filter(Boolean);
    }
  }catch(e){
    // fall back to parsing as comma-separated keys
  }

  const parts = raw.split(',').map(s => s.trim()).filter(Boolean);
  return parts.map(part => {
    const parts = part.split('|');
    return {title: parts[0] || '', location: parts[1] || '', salary: parseFloat(parts[2]) || 0};
  });
}

function getSavedJobsFromStorage(){
  let raw = sessionStorage.getItem('savedJobsData') || localStorage.getItem('savedJobsData');
  if(!raw && location.hash.startsWith('#saved=')){
    try{ raw = decodeURIComponent(location.hash.slice(7)); }catch(e){ raw = null; }
  }
  return parseSavedJobsRaw(raw);
}

function setSavedJobs(jobs){
  const str = JSON.stringify(jobs);
  localStorage.setItem('savedJobsData', str);
  sessionStorage.setItem('savedJobsData', str);

  const keys = jobs.map(getJobKey);
  const keyStr = JSON.stringify(Array.from(new Set(keys)));
  localStorage.setItem('savedJobs', keyStr);
  sessionStorage.setItem('savedJobs', keyStr);
}

function updateSavedCount(count){
  const badge = document.getElementById('savedCount');
  if(!badge) return;
  if(count > 0){
    badge.textContent = count;
    badge.style.display = 'flex';
  } else {
    badge.style.display = 'none';
  }
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
  setTimeout(()=>{ sn.className = 'snackbar'; }, 3000);
}

const modal = document.getElementById('detailModal');
const modalTitle = document.getElementById('modalTitle');
const modalMeta = document.getElementById('modalMeta');
const modalDescription = document.getElementById('modalDescription');
const modalClose = document.getElementById('modalClose');

function openModal(job){
  modalTitle.textContent = job.title;
  modalMeta.textContent = `${job.location} • RM${(job.salary||0).toLocaleString()}`;
  const html = (job.description || '')
                .replace(/\n/g,'<br>')
                .replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>');
  modalDescription.innerHTML = html;
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden','false');
}

function closeModal(){
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden','true');
}

if(modalClose){
  modalClose.addEventListener('click', closeModal);
}
if(modal){
  modal.addEventListener('click', e => { if(e.target === modal) closeModal(); });
}

function renderSavedJobs(){
  const container = document.getElementById('savedJobs');
  const jobs = getSavedJobsFromStorage();
  updateSavedCount(jobs.length);

  if(!container) return;
  container.innerHTML = '';

  if(jobs.length === 0){
    container.innerHTML = `
      <div class="job-card no-results">
        <div class="no-results-emoji anime-emoji">💾</div>
        <div class="no-results-text">
          No saved jobs yet.<br/>
          Go back to the search page and tap the star to save jobs you like.
        </div>
      </div>
    `;
    const clearBtn = document.getElementById('clearBtn');
    if(clearBtn) clearBtn.style.display = 'none';
    return;
  }

  const clearBtn = document.getElementById('clearBtn');
  if(clearBtn) clearBtn.style.display = 'inline-block';

  for(const job of jobs){
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
    meta.textContent = `${job.location} • RM${(job.salary||0).toLocaleString()}`;
    left.appendChild(icon);
    left.appendChild(title);
    left.appendChild(meta);

    const right = document.createElement('div');
    right.className = 'job-right';

    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn remove';
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', e => {
      e.stopPropagation();
      const list = getSavedJobsFromStorage().filter(j => getJobKey(j) !== getJobKey(job));
      setSavedJobs(list);
      showSnackbar('Removed from saved', 'success');
      renderSavedJobs();
    });

    right.appendChild(removeBtn);

    card.addEventListener('click', () => openModal(job));
    card.appendChild(left);
    card.appendChild(right);
    container.appendChild(card);
  }
}

// avatar handling (shared behavior)
const avatarImg = document.getElementById('avatarImg');
const avatarInput = document.getElementById('avatarInput');

function loadAvatar(){
  const data = localStorage.getItem('avatar');
  if(data && avatarImg){ avatarImg.src = data; }
}
function saveAvatar(dataUrl){
  localStorage.setItem('avatar', dataUrl);
}

if(avatarInput){
  avatarInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if(file){
      const reader = new FileReader();
      reader.onload = ev => {
        const url = ev.target.result;
        if(avatarImg) avatarImg.src = url;
        saveAvatar(url);
      };
      reader.readAsDataURL(file);
    }
  });
}

const backBtn = document.getElementById('backBtn');
if(backBtn){
  backBtn.addEventListener('click', e => {
    // make sure saved jobs are persisted before returning
    const jobs = getSavedJobsFromStorage();
    setSavedJobs(jobs);
  });
}

const clearBtn = document.getElementById('clearBtn');
if(clearBtn){
  clearBtn.addEventListener('click', () => {
    setSavedJobs([]);
    showSnackbar('All saved jobs cleared', 'success');
    renderSavedJobs();
  });
}

loadAvatar();
renderSavedJobs();
