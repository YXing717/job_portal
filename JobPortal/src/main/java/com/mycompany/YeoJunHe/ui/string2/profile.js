// profile.js - display saved job posts and allow removal

function getSavedJobs(){
  const raw = localStorage.getItem('savedJobs');
  return raw ? JSON.parse(raw) : [];
}
function removeSavedJob(job){
  let list = getSavedJobs();
  list = list.filter(j=>!(j.title===job.title && j.location===job.location && j.salary===job.salary));
  localStorage.setItem('savedJobs', JSON.stringify(list));
  return list;
}

const savedResultsEl = document.getElementById('savedResults');
const savedPaginationEl = document.getElementById('savedPagination');
const DEFAULT_PAGE_SIZE = 5;
let currentList = [];
let currentPage = 1;

function getPageSize(){
  return DEFAULT_PAGE_SIZE; // fixed for now
}

function renderSaved(page=1){
  const pageSize = getPageSize();
  currentPage = page;
  const total = currentList.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if(page>totalPages) page = totalPages;
  const from = (page-1)*pageSize;
  const to = Math.min(from+pageSize, total);

  savedResultsEl.innerHTML = '';
  if(total === 0){
    savedResultsEl.innerHTML = `
      <div class="job-card no-results">
        <div class="no-results-emoji anime-emoji">🤷</div>
        <div class="no-results-text">
          You haven't saved any jobs yet.<br/>
          Return to search and click "Save" on a job that interests you.
        </div>
      </div>
    `;
    savedPaginationEl.innerHTML = '';
    return;
  }

  for(let i=from;i<to;i++){
    const j = currentList[i];
    const card = document.createElement('div'); card.className='job-card';
    const left = document.createElement('div'); left.className='job-left';
    const icon = document.createElement('div'); icon.className='job-icon'; icon.textContent = '💼';
    const title = document.createElement('div'); title.className='job-title'; title.textContent = j.title;
    const meta = document.createElement('div'); meta.className='job-meta'; meta.textContent = `${j.location} • RM${j.salary.toLocaleString()}`;
    left.appendChild(icon);
    left.appendChild(title);
    left.appendChild(meta);
    if(j.tagline){
      const tags = document.createElement('div'); tags.className='job-tags'; tags.textContent = j.tagline;
      left.appendChild(tags);
    }
    const right = document.createElement('div'); right.className='job-right';

    const removeBtn = document.createElement('button');
    removeBtn.className='btn remove';
    removeBtn.textContent='Remove';
    removeBtn.onclick = e => {
      e.stopPropagation();
      currentList = removeSavedJob(j);
      renderSaved(currentPage);
    };
    right.appendChild(removeBtn);

    card.appendChild(left); card.appendChild(right);
    // if main page code is loaded, allow viewing details via modal
    if(typeof openModal === 'function'){
      card.addEventListener('click', () => openModal(j));
    }
    savedResultsEl.appendChild(card);
  }

  // paging similar to main page
  savedPaginationEl.innerHTML = '';
  const createBtn = (label, idx, active=false) => {
    const b = document.createElement('button'); b.className='page-btn' + (active? ' active':''); b.textContent = label; b.onclick = () => renderSaved(idx);
    return b;
  };
  if(totalPages <= 7){
    for(let p=1;p<=totalPages;p++) savedPaginationEl.appendChild(createBtn(p, p, p===page));
  } else {
    if(page>1) savedPaginationEl.appendChild(createBtn('Prev', Math.max(1,page-1)));
    const start = Math.max(1, page-2);
    const end = Math.min(totalPages, page+2);
    if(start>1) savedPaginationEl.appendChild(createBtn('1',1));
    if(start>2) savedPaginationEl.appendChild(document.createTextNode('...'));
    for(let p=start;p<=end;p++) savedPaginationEl.appendChild(createBtn(p,p,p===page));
    if(end<totalPages-1) savedPaginationEl.appendChild(document.createTextNode('...'));
    if(end<totalPages) savedPaginationEl.appendChild(createBtn(totalPages,totalPages));
    if(page<totalPages) savedPaginationEl.appendChild(createBtn('Next', Math.min(totalPages,page+1)));
  }
}

function init(){
  currentList = getSavedJobs();
  renderSaved(1);
  const clearBtn = document.getElementById('clearAllBtn');
  if(clearBtn){
    const updateBtn = () => {
      clearBtn.style.display = currentList.length ? 'inline-block' : 'none';
    };
    clearBtn.addEventListener('click', ()=>{
      if(confirm('Remove all saved jobs?')){
        localStorage.removeItem('savedJobs');
        currentList = [];
        renderSaved(1);
        updateBtn();
      }
    });
    updateBtn();
  }
}

window.addEventListener('DOMContentLoaded', init);
