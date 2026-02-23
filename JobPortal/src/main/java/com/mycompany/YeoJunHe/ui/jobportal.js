// Sample jobs (same data as console sample)
const JOBS = [
  {title:"Software Engineer", location:"New York", salary:120000},
  {title:"Senior Software Engineer", location:"San Francisco", salary:160000},
  {title:"Engineering Manager", location:"Austin", salary:150000},
  {title:"Mechanical Engineer", location:"Detroit", salary:90000},
  {title:"Civil Engineer", location:"Denver", salary:95000},
  {title:"QA Engineer", location:"Remote", salary:85000},
  {title:"Software Developer", location:"Remote", salary:110000},
  {title:"Data Scientist", location:"Boston", salary:130000},
  {title:"Research Engineer", location:"Palo Alto", salary:140000},
  {title:"Electrical Engineer", location:"Chicago", salary:100000},
  {title:"English Teacher", location:"Seoul", salary:40000},
  {title:"Engineering Technician", location:"Columbus", salary:70000}
];

function normalize(s){
  if(!s) return "";
  // remove diacritics
  s = s.normalize('NFD').replace(/\p{Diacritic}/gu, '');
  // remove non-alnum except spaces
  s = s.replace(/[^\p{L}\p{N} ]+/gu,' ');
  return s.toLowerCase().trim().replace(/\s+/g,' ');
}

function searchJobs(query, mode){
  const q = normalize(query);
  if(mode === 'exact') return JOBS.filter(j => normalize(j.title) === q);
  if(mode === 'partial') return JOBS.filter(j => normalize(j.title).includes(q));
  if(mode === 'multi'){
    const parts = q ? q.split(' ') : [];
    return JOBS.filter(j => {
      const t = normalize(j.title);
      return parts.length === 0 ? false : parts.every(p => t.includes(p));
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

// UI wiring
const input = document.getElementById('searchInput');
const suggestionsEl = document.getElementById('suggestions');
const searchBtn = document.getElementById('searchBtn');
const modeSelect = document.getElementById('modeSelect');
const resultsEl = document.getElementById('results');
const paginationEl = document.getElementById('pagination');
const pageSizeInput = document.getElementById('pageSize');

let currentResults = [];
let currentPage = 1;

function renderResults(page=1){
  const pageSize = Math.max(1, parseInt(pageSizeInput.value)||5);
  currentPage = page;
  const total = currentResults.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if(page>totalPages) page = totalPages;
  const from = (page-1)*pageSize;
  const to = Math.min(from+pageSize, total);

  resultsEl.innerHTML = '';
  if(total === 0){ resultsEl.innerHTML = '<div class="job-card">No matches</div>'; paginationEl.innerHTML=''; return; }

  for(let i=from;i<to;i++){
    const j = currentResults[i];
    const card = document.createElement('div'); card.className='job-card';
    const left = document.createElement('div'); left.className='job-left';
    const title = document.createElement('div'); title.className='job-title'; title.textContent = j.title;
    const meta = document.createElement('div'); meta.className='job-meta'; meta.textContent = `${j.location} • $${j.salary.toLocaleString()}`;
    left.appendChild(title); left.appendChild(meta);
    const right = document.createElement('div'); right.className='job-right'; right.textContent = '';
    card.appendChild(left); card.appendChild(right);
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
  const v = e.target.value;
  if(!v) { suggestionsEl.innerHTML=''; suggestionsEl.style.display='none'; return; }
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

searchBtn.addEventListener('click', ()=>{
  const q = input.value.trim();
  const mode = modeSelect.value;
  currentResults = searchJobs(q, mode);
  renderResults(1);
});

pageSizeInput.addEventListener('change', ()=> renderResults(1));

// initial empty state
currentResults = [];
renderResults(1);
