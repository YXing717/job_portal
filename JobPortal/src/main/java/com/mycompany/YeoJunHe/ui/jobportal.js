const JOBS = [
  // original seed jobs
  {title:"Software Engineer", location:"Kuala Lumpur", salary:9000},
  {title:"Senior Software Engineer", location:"Penang", salary:8500},
  {title:"Engineering Manager", location:"Johor Bahru", salary:8000},
  {title:"Mechanical Engineer", location:"Kuala Lumpur", salary:7500},
  {title:"Civil Engineer", location:"Kuantan", salary:7000},
  {title:"QA Engineer", location:"Ipoh", salary:6800},
  {title:"Software Developer", location:"Malacca", salary:6200},
  {title:"Data Scientist", location:"Cyberjaya", salary:7800},
  {title:"Research Engineer", location:"Putrajaya", salary:8200},
  {title:"Electrical Engineer", location:"George Town", salary:7300},
  {title:"English Teacher", location:"Kota Kinabalu", salary:1800},
  {title:"Engineering Technician", location:"Kuching", salary:2400},
  {title:"Frontend Developer", location:"Shah Alam", salary:5600},
  {title:"Product Manager", location:"Petaling Jaya", salary:8800},
  {title:"UX Designer", location:"Seremban", salary:4900},
  {title:"DevOps Engineer", location:"Kuala Lumpur", salary:8800},
  {title:"Backend Engineer", location:"Kuala Lumpur", salary:8300},
  {title:"Fullstack Engineer", location:"Kuala Lumpur", salary:8700},
  {title:"Mobile Developer", location:"Penang", salary:7100},
  {title:"Network Engineer", location:"Penang", salary:7400},
  {title:"Security Analyst", location:"Penang", salary:7600},
  {title:"Civil Supervisor", location:"Johor Bahru", salary:6900},
  {title:"Site Engineer", location:"Johor Bahru", salary:7100},
  {title:"Quality Manager", location:"Johor Bahru", salary:7500},
  {title:"Project Coordinator", location:"Kuantan", salary:6600},
  {title:"Structural Engineer", location:"Kuantan", salary:7200},
  {title:"Estimator", location:"Kuantan", salary:6800},
  {title:"Test Lead", location:"Ipoh", salary:7000},
  {title:"Automation Engineer", location:"Ipoh", salary:7300},
  {title:"Support Technician", location:"Ipoh", salary:6500},
  {title:"Web Developer", location:"Malacca", salary:6000},
  {title:"Database Admin", location:"Malacca", salary:6400},
  {title:"IT Consultant", location:"Malacca", salary:6600},
  {title:"C++ Developer", location:"Cyberjaya", salary:7500},
  {title:"AI Engineer", location:"Cyberjaya", salary:8200},
  {title:"Cloud Architect", location:"Cyberjaya", salary:9000},
  {title:"Business Analyst", location:"Cyberjaya", salary:7700},
  {title:"Lab Technician", location:"Putrajaya", salary:6800},
  {title:"Policy Advisor", location:"Putrajaya", salary:7600},
  {title:"Admin Officer", location:"Putrajaya", salary:6000},
  {title:"Hardware Engineer", location:"George Town", salary:7200},
  {title:"UX Researcher", location:"George Town", salary:7000},
  {title:"Product Designer", location:"George Town", salary:7500},
  {title:"Language Instructor", location:"Kota Kinabalu", salary:2000},
  {title:"Tour Guide", location:"Kota Kinabalu", salary:2300},
  {title:"Hotel Manager", location:"Kota Kinabalu", salary:3000},
  {title:"Forest Ranger", location:"Kuching", salary:2600},
  {title:"Marine Biologist", location:"Kuching", salary:2800},
  {title:"Logistics Coordinator", location:"Kuching", salary:2500},
  {title:"UX/UI Designer", location:"Shah Alam", salary:5800},
  {title:"Digital Marketer", location:"Shah Alam", salary:5400},
  {title:"Content Writer", location:"Shah Alam", salary:5200},
  {title:"Sales Executive", location:"Petaling Jaya", salary:8600},
  {title:"HR Specialist", location:"Petaling Jaya", salary:8200},
  {title:"Financial Analyst", location:"Petaling Jaya", salary:9000},
  {title:"Graphic Designer", location:"Seremban", salary:5000},
  {title:"Customer Support", location:"Seremban", salary:4700},
  {title:"Operations Manager", location:"Seremban", salary:5300},
  {title:"Software Engineer", location:"Malacca", salary:9100},
  {title:"Software Engineer", location:"Ipoh", salary:8800},
  {title:"UX Designer", location:"Kuantan", salary:5200},
  {title:"UX Designer", location:"Kuala Lumpur", salary:5500},
  {title:"Data Engineer", location:"Kuala Lumpur", salary:7800},
  {title:"Technical Writer", location:"Penang", salary:5000},
  {title:"Accountant", location:"Johor Bahru", salary:6200},
  {title:"Logistics Manager", location:"Kuantan", salary:7100},
  {title:"Pharmaceutical Rep", location:"Ipoh", salary:6400},
  {title:"Public Relations", location:"Malacca", salary:6900},
  {title:"Sales Manager", location:"Cyberjaya", salary:8100},
  {title:"Event Planner", location:"Putrajaya", salary:5800},
  {title:"Clinical Nurse", location:"George Town", salary:6700},
  {title:"Environmental Scientist", location:"Kota Kinabalu", salary:7200},
  {title:"Civil Drafter", location:"Kuching", salary:5300},
  {title:"IT Support", location:"Shah Alam", salary:5600},
  {title:"Graphic Designer", location:"Petaling Jaya", salary:6200},
  {title:"Research Assistant", location:"Seremban", salary:4800},
  {title:"Security Guard", location:"Kuala Lumpur", salary:3100},
  {title:"Receptionist", location:"Penang", salary:3000},
  {title:"Chef", location:"Johor Bahru", salary:4500},
  {title:"Interpreter", location:"Kuantan", salary:4000},
  {title:"Copywriter", location:"Ipoh", salary:5400},
  {title:"Dietician", location:"Malacca", salary:5900},
  {title:"HR Assistant", location:"Cyberjaya", salary:6200},
  {title:"Museum Curator", location:"Putrajaya", salary:6500}
];

function normalize(s){
  if(!s) return "";
  // remove diacritics
  s = s.normalize('NFD').replace(/\p{Diacritic}/gu, '');
  // remove non-alnum except spaces
  s = s.replace(/[^\p{L}\p{N} ]+/gu,' ');
  return s.toLowerCase().trim().replace(/\s+/g,' ');
}

// basic front-end sanitization – strip characters commonly used in SQL/JS injection
function sanitizeInput(str){
  if(!str) return '';
  // remove semicolons, quotes, double-dash, slash star etc.
  return str.replace(/["'`;\\]/g,'')
            .replace(/--/g,'')
            .replace(/\/\*/g,'').replace(/\*\//g,'')
            .trim();
}

// helpers to create richer descriptions
function getSkillsForTitle(title){
  const mapping = {
    'software engineer': ['JavaScript/Java', 'REST APIs', 'SQL', 'version control'],
    'senior software engineer': ['architecture design', 'mentoring', 'performance tuning'],
    'engineering manager': ['team leadership', 'project management', 'stakeholder communication'],
    'mechanical engineer': ['CAD', 'mechanical design', 'manufacturing processes'],
    'civil engineer': ['structural analysis', 'AutoCAD', 'site supervision'],
    'qa engineer': ['test automation', 'Selenium', 'bug tracking'],
    'data scientist': ['Python/R', 'machine learning', 'statistics'],
    'frontend developer': ['HTML/CSS', 'React/Vue', 'responsive design'],
    'product manager': ['roadmapping', 'user research', 'agile methodologies'],
    'ux designer': ['user-centered design', 'prototyping', 'Figma'],
    'devops engineer': ['CI/CD', 'Docker/Kubernetes', 'cloud platforms'],
    'backend engineer': ['database design', 'API development', 'server-side languages'],
    'fullstack engineer': ['frontend frameworks', 'backend APIs', 'databases'],
    'mobile developer': ['iOS/Android SDKs', 'react native/flutter', 'mobile UI/UX'],
    'network engineer': ['routing/switching', 'firewalls', 'network security'],
    'security analyst': ['vulnerability assessment', 'SIEM', 'incident response'],
    // default fallback
  };
  const key = title.toLowerCase();
  return mapping[key] || ['relevant skills in the field'];
}

function getBenefits(){
  return ['health insurance','EPF/CPF contributions','performance bonus','flexible hours','remote work options'];
}

function getCompanyBackground(location){
  // simple placeholder background; could be made more advanced
  return `A leading organisation headquartered in ${location} with a dynamic work culture.`;
}

// generate description text for a job object if not already present
function buildDescription(job){
  const title = job.title;
  const loc = job.location;
  const baseSalary = job.salary;
  const lower = Math.round(baseSalary * 0.9);
  const upper = Math.round(baseSalary * 1.1);
  const salaryRange = `RM${lower.toLocaleString()} - RM${upper.toLocaleString()}`;
  const skills = getSkillsForTitle(title).join(', ');
  const benefits = getBenefits().join(', ');
  const companyBg = getCompanyBackground(loc);

  return `${companyBg}\n\n` +
         `**Position:** ${title} (${loc})\n` +
         `**Salary Range:** ${salaryRange}\n\n` +
         `**About the Role:**\n` +
         `We are seeking a ${title} to join our team in ${loc}. The ideal candidate will be responsible for day-to-day tasks related to the role, collaborate with cross-functional teams, and contribute to ongoing projects. This position offers growth opportunities within the company.\n\n` +
         `**Required Skills:** ${skills}.\n\n` +
         `**Benefits:** ${benefits}.\n\n` +
         `**Why Join Us:** Our company prides itself on innovation, employee development and a supportive environment. If you're looking for a challenging yet rewarding career, this is the place to be.`;
}
// ensure every job has a description property
JOBS.forEach(j => { if(!j.description) j.description = buildDescription(j); });

// modal helpers
const modal = document.getElementById('detailModal');
const modalTitle = document.getElementById('modalTitle');
const modalMeta = document.getElementById('modalMeta');
const modalDescription = document.getElementById('modalDescription');
const modalClose = document.getElementById('modalClose');
function openModal(job){
  modalTitle.textContent = job.title;
  modalMeta.textContent = `${job.location} • RM${job.salary.toLocaleString()}`;
  // convert newlines to <br> and simple markdown bold
  const html = job.description
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
modalClose.addEventListener('click', closeModal);
// optionally close when clicking outside content
modal.addEventListener('click', e => { if(e.target === modal) closeModal(); });

// --- saved jobs helpers using localStorage --------------------------------
function getSavedJobs(){
  const raw = localStorage.getItem('savedJobs');
  return raw ? JSON.parse(raw) : [];
}
function isJobSaved(job){
  return getSavedJobs().some(j=>j.title===job.title && j.location===job.location && j.salary===job.salary);
}
function saveJob(job){
  const list = getSavedJobs();
  if(!isJobSaved(job)){
    list.push(job);
    localStorage.setItem('savedJobs', JSON.stringify(list));
    showSnackbar('Job saved!');
  }
}
function removeSavedJob(job){
  let list = getSavedJobs();
  const before = list.length;
  list = list.filter(j=>!(j.title===job.title && j.location===job.location && j.salary===job.salary));
  if(list.length < before){
    localStorage.setItem('savedJobs', JSON.stringify(list));
    showSnackbar('Removed from saved');
  }
}

// simple toast message at bottom
function showSnackbar(msg){
  let sn = document.getElementById('snackbar');
  if(!sn){
    sn = document.createElement('div');
    sn.id='snackbar';
    sn.className='snackbar';
    document.body.appendChild(sn);
  }
  sn.textContent = msg;
  sn.className = 'snackbar show';
  setTimeout(()=>{ sn.className = 'snackbar'; }, 3000);
}

// update modal open/close to manage save button
const modalSave = document.getElementById('modalSave');
function openModal(job){
  modalTitle.textContent = job.title;
  modalMeta.textContent = `${job.location} • RM${job.salary.toLocaleString()}`;
  const html = job.description
                .replace(/\n/g,'<br>')
                .replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>');
  modalDescription.innerHTML = html;
  // configure save button
  if(modalSave){
    modalSave.style.display = 'inline-block';
    const updateSaveText = () => {
      if(isJobSaved(job)){
        modalSave.textContent = 'Saved';
        modalSave.classList.add('saved');
      } else {
        modalSave.textContent = 'Save';
        modalSave.classList.remove('saved');
      }
    };
    updateSaveText();
    modalSave.onclick = e => {
      e.stopPropagation();
      if(isJobSaved(job)){
        removeSavedJob(job);
      } else {
        saveJob(job);
      }
      updateSaveText();
      // refresh listing so cards show updated icon
      if(currentResults && currentResults.length){ renderResults(currentPage); }
    };
  }
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden','false');
}

function searchJobs(query, mode){
  const q = normalize(query);
  if(mode === 'exact') return JOBS.filter(j => normalize(j.title) === q);
  if(mode === 'partial') return JOBS.filter(j => normalize(j.title).includes(q));
  if(mode === 'multi'){
    // keywords separated by comma; numeric token treated as salary minimum
    const rawParts = query.split(',').map(s => s.trim()).filter(s => s !== '');
    let minSalary = 0;
    const tokens = [];
    for(const part of rawParts){
      // if numeric value, treat as salary floor
      const num = parseFloat(part.replace(/[^0-9.]/g, ''));
      if(!isNaN(num) && num.toString() === part){
        minSalary = Math.max(minSalary, num);
      } else {
        tokens.push(normalize(part));
      }
    }
    return JOBS.filter(j => {
      if(j.salary < minSalary) return false;
      const title = normalize(j.title);
      const loc = normalize(j.location);
      // generate acronym from location words (e.g. Kuala Lumpur -> KL)
      const locWords = loc.split(' ').filter(w => w.length > 0);
      const locAcronym = locWords.map(w => w[0]).join('');
      return tokens.every(tok =>
        title.includes(tok) ||
        loc.includes(tok) ||
        locAcronym.includes(tok)
      );
    });
  }
  return [];
}

function autoSuggest(prefix, limit=8){
  const p = normalize(prefix);
  if(!p) return [];
  const set = new Set();
  for(const j of JOBS){
    const n = normalize(j.title);
    if(n.startsWith(p) || n.includes(p)) set.add(j.title);
  }
  const arr = Array.from(set);
  arr.sort((a,b) => {
    const na = normalize(a), nb = normalize(b);
    if(na === nb) return a.length - b.length;
    return na < nb ? -1 : 1;
  });
  return arr.slice(0, limit);
}

const input = document.getElementById('searchInput');
const suggestionsEl = document.getElementById('suggestions');
const searchBtn = document.getElementById('searchBtn');
const modeSelect = document.getElementById('modeSelect');
const resultsEl = document.getElementById('results');
const paginationEl = document.getElementById('pagination');
const pageSizeInput = document.getElementById('pageSize');
const DEFAULT_PAGE_SIZE = 5;

let currentResults = [];
let currentPage = 1;

function getPageSize(){
  if(pageSizeInput) return Math.max(1, parseInt(pageSizeInput.value)||DEFAULT_PAGE_SIZE);
  return DEFAULT_PAGE_SIZE;
}

function renderResults(page=1){
  const pageSize = getPageSize();
  currentPage = page;
  const total = currentResults.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if(page>totalPages) page = totalPages;
  const from = (page-1)*pageSize;
  const to = Math.min(from+pageSize, total);

  resultsEl.innerHTML = '';
  if(total === 0){
    // show a little apologetic person and suggestion
    resultsEl.innerHTML = `
      <div class="job-card no-results">
        <div class="no-results-emoji anime-emoji">😭</div>
        <div class="no-results-text">
          Sorry, no results found.<br/>
          Try clearing filters or broadening your search.
        </div>
      </div>
    `;
    paginationEl.innerHTML='';
    return;
  }

  for(let i=from;i<to;i++){
    const j = currentResults[i];
    const card = document.createElement('div'); card.className='job-card';
    const left = document.createElement('div'); left.className='job-left';
    // icon representing a briefcase for jobs
    const icon = document.createElement('div'); icon.className='job-icon'; icon.textContent = '💼';
    const title = document.createElement('div'); title.className='job-title'; title.textContent = j.title;
    const meta = document.createElement('div'); meta.className='job-meta'; meta.textContent = `${j.location} • RM${j.salary.toLocaleString()}`;
    left.appendChild(icon);
    left.appendChild(title);
    left.appendChild(meta);
    const right = document.createElement('div'); right.className='job-right';
    // if already saved, mark with heart
    if(isJobSaved(j)){
      const heart = document.createElement('span'); heart.textContent='❤️'; heart.title='Saved';
      right.appendChild(heart);
    }
    card.appendChild(left); card.appendChild(right);
    // show detail modal when clicking the card
    card.addEventListener('click', () => openModal(j));
    resultsEl.appendChild(card);
  }

  // pagination
  paginationEl.innerHTML = '';
  const createBtn = (label, idx, active=false) => {
    const b = document.createElement('button'); b.className='page-btn' + (active? ' active':''); b.textContent = label; b.onclick = () => renderResults(idx);
    return b;
  };

  if(totalPages <= 7){
    for(let p=1;p<=totalPages;p++) paginationEl.appendChild(createBtn(p, p, p===page));
  } else {
    if(page>1) paginationEl.appendChild(createBtn('Prev', Math.max(1,page-1)));
    const start = Math.max(1, page-2);
    const end = Math.min(totalPages, page+2);
    if(start>1) paginationEl.appendChild(createBtn('1',1));
    if(start>2) paginationEl.appendChild(document.createTextNode('...'));
    for(let p=start;p<=end;p++) paginationEl.appendChild(createBtn(p,p,p===page));
    if(end<totalPages-1) paginationEl.appendChild(document.createTextNode('...'));
    if(end<totalPages) paginationEl.appendChild(createBtn(totalPages,totalPages));
    if(page<totalPages) paginationEl.appendChild(createBtn('Next', Math.min(totalPages,page+1)));
  }
}

let suggestTimer = null;
input.addEventListener('input', e => {
  clearTimeout(suggestTimer);
  let v = e.target.value;
  if(!v) { suggestionsEl.innerHTML=''; suggestionsEl.style.display='none'; return; }
  v = sanitizeInput(v);  // make sure suggestion algorithm sees cleaned string
  suggestTimer = setTimeout(()=>{
    const arr = autoSuggest(v, 8);
    suggestionsEl.innerHTML = '';
    if(arr.length === 0){ suggestionsEl.style.display='none'; return; }
    for(const s of arr){
      const li = document.createElement('li'); li.textContent = s; li.onclick = () => { input.value = s; suggestionsEl.innerHTML=''; suggestionsEl.style.display='none'; };
      suggestionsEl.appendChild(li);
    }
    suggestionsEl.style.display = 'block';
  }, 160);
});

// hide suggestions when clicking anywhere outside the input or the list
document.addEventListener('click', e => {
  if(!input.contains(e.target) && !suggestionsEl.contains(e.target)){
    suggestionsEl.style.display = 'none';
  }
});

// tooltip for search mode information
const infoBtn = document.getElementById('infoBtn');
const infoTooltip = document.getElementById('infoTooltip');
if(infoBtn && infoTooltip){
  infoBtn.addEventListener('mouseover', () => { infoTooltip.style.display = 'block'; });
  infoBtn.addEventListener('mouseout', () => { infoTooltip.style.display = 'none'; });
}


searchBtn.addEventListener('click', ()=>{
  // show loading state
  searchBtn.classList.add('loading');
  setTimeout(()=>{
    // sanitize before searching
    const raw = input.value.trim();
    const q = sanitizeInput(raw);
    const mode = modeSelect.value;
    currentResults = searchJobs(q, mode);
    renderResults(1);
    searchBtn.classList.remove('loading');
  }, 150); // slight delay so spinner is visible
});

// when user presses Enter in the search box, perform the search too
input.addEventListener('keydown', e => {
  if(e.key === 'Enter'){
    e.preventDefault();
    searchBtn.click();
  }
});

if(pageSizeInput){
  pageSizeInput.addEventListener('change', ()=> renderResults(1));
}

// initial empty state
currentResults = [];
renderResults(1);
