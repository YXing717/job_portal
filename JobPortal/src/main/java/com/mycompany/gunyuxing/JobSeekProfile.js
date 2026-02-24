// loads stored profile and renders it
function loadViewProfile() {
    let stored = localStorage.getItem('profileData');
    if (!stored) {
        return;
    }
    try {
        const data = JSON.parse(stored);
        const skillsEl = document.getElementById('view-skills');
        skillsEl.innerHTML = '';
        (data.skills || []).forEach(s => {
            const li = document.createElement('li');
            li.textContent = s;
            skillsEl.appendChild(li);
        });
        const expEl = document.getElementById('view-exp');
        expEl.innerHTML = '';
        (data.workExperiences || []).forEach(exp => {
            const li = document.createElement('li');
            li.innerHTML = `${exp.jobTitle} at ${exp.company} (${exp.startDate} - ${exp.endDate})<br>${exp.description}`;
            expEl.appendChild(li);
        });
    } catch (e) {
        console.warn('failed to parse profile data', e);
    }
}

function goEdit() {
    window.location.href = 'JobSeekProfileEdit.html';
}

// run on load
loadViewProfile();