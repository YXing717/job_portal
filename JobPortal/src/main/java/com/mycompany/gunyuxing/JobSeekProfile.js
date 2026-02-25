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

// Profile image upload, About Me, and Location logic
document.addEventListener('DOMContentLoaded', function () {
    // Profile image logic
    const imgInput = document.getElementById('profileImgInput');
    const img = document.getElementById('profileImage');
    const placeholder = document.getElementById('profileImgPlaceholder');
    const IMG_KEY = 'jobportal_profile_img';
    const savedImg = localStorage.getItem(IMG_KEY);
    if (savedImg) {
        img.src = savedImg;
        img.style.display = 'block';
        placeholder.style.display = 'none';
    } else {
        img.src = '';
        img.style.display = 'none';
        placeholder.style.display = 'flex';
    }
    imgInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function (evt) {
                img.src = evt.target.result;
                img.style.display = 'block';
                placeholder.style.display = 'none';
                localStorage.setItem(IMG_KEY, evt.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    // About Me logic
    const aboutMeText = document.getElementById('aboutMeText');
    const aboutMeEditBtn = document.getElementById('aboutMeEditBtn');
    const aboutMePenIcon = document.getElementById('aboutMePenIcon');
    const ABOUT_KEY = 'jobportal_about_me';
    // Load About Me
    const savedAbout = localStorage.getItem(ABOUT_KEY);
    if (savedAbout) aboutMeText.value = savedAbout;
    let aboutEditMode = false;
    function setAboutEditMode(edit) {
        aboutEditMode = edit;
        aboutMeText.disabled = !edit;
        if (edit) {
            aboutMeEditBtn.innerHTML = 'Done';
            aboutMeEditBtn.style.background = '#2196f3';
            aboutMeEditBtn.style.color = '#fff';
        } else {
            aboutMeEditBtn.innerHTML = '';
            aboutMeEditBtn.appendChild(aboutMePenIcon);
            aboutMeEditBtn.style.background = 'none';
            aboutMeEditBtn.style.color = '';
        }
    }
    setAboutEditMode(false);
    aboutMeEditBtn.addEventListener('click', function () {
        if (!aboutEditMode) {
            setAboutEditMode(true);
            aboutMeText.focus();
        } else {
            setAboutEditMode(false);
            localStorage.setItem(ABOUT_KEY, aboutMeText.value);
        }
    });

    // Location logic
    const locationSelect = document.getElementById('locationSelect');
    const LOC_KEY = 'jobportal_location';
    const savedLoc = localStorage.getItem(LOC_KEY);
    if (savedLoc) locationSelect.value = savedLoc;
    locationSelect.addEventListener('change', function () {
        localStorage.setItem(LOC_KEY, locationSelect.value);
    });
});

// run on load
loadViewProfile();