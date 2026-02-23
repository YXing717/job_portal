let profileData = { skills: [], workExperiences: [] };

const backendUrl = 'http://localhost:8080/profile';

async function loadProfile() {
    try {
        const response = await fetch(backendUrl);
        if (response.ok) {
            const users = await response.json();
            profileData = users[0].profile; // Assume single user
            renderSkills();
            renderExperiences();
        }
    } catch (e) {
        showMessage('Backend not connected', 'error');
    }
}

async function saveProfile() {
    try {
        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([{ profile: profileData }]) // Wrap in array for consistency
        });
        if (response.ok) {
            showMessage('Saved to backend!', 'success');
        }
    } catch (e) {
        showMessage('Save failed', 'error');
    }
}

// Render, add, remove functions (similar to previous)
function renderSkills() {
    const list = document.getElementById('skills-list');
    list.innerHTML = '';
    profileData.skills.forEach((skill, idx) => {
        list.innerHTML += `<li>${skill} <button onclick="removeSkill(${idx})">Remove</button></li>`;
    });
}

function addSkill() {
    const input = document.getElementById('skill-input').value.trim();
    if (!input) return showMessage('Empty skill', 'error');
    profileData.skills.push(input);
    renderSkills();
    saveProfile();
}

function removeSkill(idx) {
    profileData.skills.splice(idx, 1);
    renderSkills();
    saveProfile();
}

function renderExperiences() {
    const list = document.getElementById('exp-list');
    list.innerHTML = '';
    profileData.workExperiences.forEach((exp, idx) => {
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
    profileData.workExperiences.push(exp);
    renderExperiences();
    saveProfile();
}

function removeExperience(idx) {
    profileData.workExperiences.splice(idx, 1);
    renderExperiences();
    saveProfile();
}

function showMessage(msg, type) {
    const div = document.getElementById('message');
    div.textContent = msg;
    div.className = type;
}

loadProfile();