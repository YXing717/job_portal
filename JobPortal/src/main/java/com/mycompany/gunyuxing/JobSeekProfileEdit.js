let profileData = { skills: [], workExperiences: [] };
// separate object to hold unsaved changes shown in editing area
let stagedData = { skills: [], workExperiences: [] };

// Use localStorage to persist data in browser
function loadProfile() {
    const stored = localStorage.getItem('profileData');
    if (stored) {
        try {
            profileData = JSON.parse(stored);
        } catch (e) {
            console.warn('Could not parse stored profile data', e);
        }
    }
    // staging area starts as a copy of saved profile
    stagedData = {
        skills: profileData.skills ? profileData.skills.slice() : [],
        workExperiences: profileData.workExperiences ? profileData.workExperiences.slice() : []
    };
    renderSkills();
    renderExperiences();
}

function saveProfile() {
    try {
        // replace the saved profile with whatever is currently staged (update)
        profileData = {
            skills: stagedData.skills.slice(),
            workExperiences: stagedData.workExperiences.slice()
        };

        localStorage.setItem('profileData', JSON.stringify(profileData));
        showMessage('Saved locally!', 'success');
        // clear staged edits and UI lists
        stagedData = { skills: [], workExperiences: [] };
        // no remove-mode state to reset
        renderSkills();
        renderExperiences();
        // after saving, navigate back to view page
        window.location.href = 'JobSeekProfile.html';
    } catch (e) {
        showMessage('Save failed', 'error');
    }
}

// determine if any input field contains text but is not yet added/staged
function formHasUnsubmittedData() {
    const skillInput = document.getElementById('skill-input').value.trim();
    const title = document.getElementById('title').value.trim();
    const company = document.getElementById('company').value.trim();
    const start = document.getElementById('start').value.trim();
    const end = document.getElementById('end').value.trim();
    const desc = document.getElementById('desc').value.trim();
    return skillInput !== '' || title !== '' || company !== '' || start !== '' || end !== '' || desc !== '';
}


function maybeSave() {
    const suppressed = localStorage.getItem('suppressIncompleteWarning');
    if (formHasUnsubmittedData() && !suppressed) {
        showConfirmDialog();
    } else {
        saveProfile();
    }
}

function showConfirmDialog() {
    const dialog = document.getElementById('confirm-dialog');
    if (dialog) dialog.style.display = 'flex';
}
function hideConfirmDialog() {
    const dialog = document.getElementById('confirm-dialog');
    if (dialog) dialog.style.display = 'none';
}

function proceedConfirm() {
    const checkbox = document.getElementById('dont-show-check');
    if (checkbox && checkbox.checked) {
        localStorage.setItem('suppressIncompleteWarning', 'true');
    }
    hideConfirmDialog();
    saveProfile();
}

function cancelConfirm() {
    hideConfirmDialog();
}

// Render, add, remove functions now operate on stagedData
function renderSkills() {
    const list = document.getElementById('skills-list');
    list.innerHTML = '';
    stagedData.skills.forEach((skill, idx) => {
        list.innerHTML += `<li>${skill} <button onclick="removeSkill(${idx})">Remove</button></li>`;
    });
}

function addSkill() {
    const inputEl = document.getElementById('skill-input');
    const input = inputEl.value.trim();
    if (!input) return showMessage('Empty skill', 'error');
    stagedData.skills.push(input);
    inputEl.value = '';
    renderSkills();
}

function removeSkill(idx) {
    stagedData.skills.splice(idx, 1);
    renderSkills();
}

function renderExperiences() {
    const list = document.getElementById('exp-list');
    list.innerHTML = '';
    stagedData.workExperiences.forEach((exp, idx) => {
        list.innerHTML += `<li>
            ${exp.jobTitle} at ${exp.company} (${exp.startDate} - ${exp.endDate})<br>${exp.description}
            <button onclick="removeExperience(${idx})">Remove</button>
        </li>`;
    });
}

function addExperience() {
    const exp = {
        jobTitle: document.getElementById('title').value.trim(),
        company: document.getElementById('company').value.trim(),
        startDate: document.getElementById('start').value.trim(),
        endDate: document.getElementById('end').value.trim(),
        description: document.getElementById('desc').value.trim()
    };
    if (!exp.jobTitle || !exp.company) return showMessage('Missing fields', 'error');
    stagedData.workExperiences.push(exp);
    // clear form fields so ready for next input
    document.getElementById('title').value = '';
    document.getElementById('company').value = '';
    document.getElementById('start').value = '';
    document.getElementById('end').value = '';
    document.getElementById('desc').value = '';
    renderExperiences();
}

function removeExperience(idx) {
    stagedData.workExperiences.splice(idx, 1);
    renderExperiences();
}

function showMessage(msg, type) {
    const div = document.getElementById('message');
    div.textContent = msg;
    div.className = type;
}


loadProfile();