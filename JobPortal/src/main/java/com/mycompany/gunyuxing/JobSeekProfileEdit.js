let profileData = { skills: [], workExperiences: [] };
// separate object to hold unsaved changes shown in editing area
let stagedData = { skills: [], workExperiences: [] };
// indices of currently editing items, -1 when not editing
let editingSkill = -1;
let editingExp = -1;

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
    editingSkill = -1;
    editingExp = -1;
    renderSkills();
    renderExperiences();
    updateSkillButton();
    updateExpButton();
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
        const cls = idx === editingSkill ? ' class="editing"' : '';
        list.innerHTML += `<li${cls}>${skill} <span>
            <button onclick="removeSkill(${idx})">Remove</button>
        </span></li>`;
    });
    updateSkillButton();
}

function addSkill() {
    const inputEl = document.getElementById('skill-input');
    const dropdown = document.getElementById('skill-suggestion');
    const input = inputEl.value.trim();
    const dropdownValue = dropdown.value;
    let added = false;
    if (editingSkill >= 0) {
        // finish editing
        if (input) {
            stagedData.skills[editingSkill] = input;
            added = true;
        }
        editingSkill = -1;
        inputEl.value = '';
        dropdown.selectedIndex = 0;
        updateSkillButton();
        updateExpButton();
        renderSkills();
        return;
    }
    // If both input and dropdown are filled and equal (case-insensitive), only add dropdown
    // Normalize all staged skills for case-insensitive comparison
    const stagedLower = stagedData.skills.map(s => s.toLowerCase());
    // If both input and dropdown are filled and equal (case-insensitive), only add dropdown if not exists
    if (
        input && dropdownValue && dropdownValue !== "" && input.toLowerCase() === dropdownValue.toLowerCase()
    ) {
        if (!stagedLower.includes(dropdownValue.toLowerCase())) {
            stagedData.skills.push(dropdownValue);
            added = true;
        }
        inputEl.value = '';
        dropdown.selectedIndex = 0;
        renderSkills();
        if (!added) showMessage('Please enter or select a unique skill', 'error');
        return;
    } else {
        if (input) {
            if (!stagedLower.includes(input.toLowerCase())) {
                stagedData.skills.push(input);
                added = true;
            }
        }
        if (dropdownValue && dropdownValue !== "" && !stagedLower.includes(dropdownValue.toLowerCase())) {
            stagedData.skills.push(dropdownValue);
            added = true;
        }
    }
    inputEl.value = '';
    dropdown.selectedIndex = 0;
    if (!added) {
        showMessage('Please enter or select a unique skill', 'error');
        return;
    }
    renderSkills();
    if (!added) {
        showMessage('Please enter or select a skill', 'error');
        return;
    }
    inputEl.value = '';
    dropdown.selectedIndex = 0;
    renderSkills();
}

function removeSkill(idx) {
    stagedData.skills.splice(idx, 1);
    if (editingSkill === idx) {
        editingSkill = -1;
        document.getElementById('skill-input').value = '';
    } else if (editingSkill > idx) {
        editingSkill--;
    }
    renderSkills();
}

function renderExperiences() {
    const list = document.getElementById('exp-list');
    list.innerHTML = '';
    stagedData.workExperiences.forEach((exp, idx) => {
        const cls = idx === editingExp ? ' class="editing"' : '';
        list.innerHTML += `<li${cls}>
            ${exp.jobTitle} at ${exp.company} (${exp.startDate} - ${exp.endDate})<br>${exp.description}
            <span>
                <button onclick="startExpEdit(${idx})">Edit</button>
                <button onclick="removeExperience(${idx})">Remove</button>
            </span>
        </li>`;
    });
    updateExpButton();
}

// begin editing a specific skill
function startSkillEdit(idx) {
    if (editingExp >= 0 || editingSkill >= 0) return; // cannot edit while another edit active
    editingSkill = idx;
    document.getElementById('skill-input').value = stagedData.skills[idx];
    updateSkillButton();
    updateExpButton();
}

function updateSkillButton() {
    const btn = document.getElementById('skill-action');
    if (!btn) return;
    btn.textContent = editingSkill >= 0 ? 'Done' : 'Add';
    btn.disabled = editingExp >= 0;
}

// begin editing a specific experience
function startExpEdit(idx) {
    if (editingSkill >= 0 || editingExp >= 0) return; // cannot edit while another edit active
    editingExp = idx;
    const exp = stagedData.workExperiences[idx];
    document.getElementById('title').value = exp.jobTitle;
    document.getElementById('company').value = exp.company;
    document.getElementById('start').value = exp.startDate;
    document.getElementById('end').value = exp.endDate;
    document.getElementById('desc').value = exp.description;
    updateExpButton();
    updateSkillButton();
}

function updateExpButton() {
    const btn = document.getElementById('exp-action');
    if (!btn) return;
    btn.textContent = editingExp >= 0 ? 'Done' : 'Add';
    btn.disabled = editingSkill >= 0;
}

function clearExperienceForm() {
    document.getElementById('title').value = '';
    document.getElementById('company').value = '';
    document.getElementById('start').value = '';
    document.getElementById('end').value = '';
    document.getElementById('desc').value = '';
}
function addExperience() {
    const expObj = {
        jobTitle: document.getElementById('title').value.trim(),
        company: document.getElementById('company').value.trim(),
        startDate: document.getElementById('start').value.trim(),
        endDate: document.getElementById('end').value.trim(),
        description: document.getElementById('desc').value.trim()
    };
    if (!expObj.jobTitle || !expObj.company) return showMessage('Missing fields', 'error');
    if (editingExp >= 0) {
        stagedData.workExperiences[editingExp] = expObj;
        editingExp = -1;
        clearExperienceForm();
        updateExpButton();
        updateSkillButton();
        renderExperiences();
        return;
    }
    stagedData.workExperiences.push(expObj);
    clearExperienceForm();
    renderExperiences();
}

function removeExperience(idx) {
    stagedData.workExperiences.splice(idx, 1);
    if (editingExp === idx) {
        editingExp = -1;
        clearExperienceForm();
    } else if (editingExp > idx) {
        editingExp--;
    }
    renderExperiences();
}

function showMessage(msg, type) {
    // Use skill-message div for skill errors, fallback to main message for others
    const skillMsg = document.getElementById('skill-message');
    const mainMsg = document.getElementById('message');
    let el = mainMsg;
    // Only use skillMsg for skill errors/success
    if (skillMsg && (type === 'error' || type === 'success')) {
        el = skillMsg;
    }
    el.textContent = msg;
    el.className = type;
    el.style.display = 'block';
    setTimeout(() => {
        el.style.display = 'none';
    }, 2500);
}


loadProfile();