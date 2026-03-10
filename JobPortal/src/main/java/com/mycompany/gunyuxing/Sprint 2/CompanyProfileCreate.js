document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('company-profile-form');
    const logoUpload = document.getElementById('logo-upload');
    const logoPreviewImg = document.getElementById('logo-preview-img');
    const placeholderIcon = document.getElementById('placeholder-icon');
    const logoError = document.getElementById('logo-error');
    const description = document.getElementById('description');
    const charCurrent = document.getElementById('char-current');
    const errorContainer = document.getElementById('error-message-container');
    const formView = document.getElementById('form-view');
    const profileView = document.getElementById('profile-view');
    const pageTitle = document.getElementById('page-title');

    // Profile Picture Elements
    const profilePicBtn = document.getElementById('profile-pic-btn');
    const profilePicUpload = document.getElementById('profile-pic-upload');
    const profilePicPreview = document.getElementById('profile-pic-preview');

    // Load Persistent Profile Picture
    const savedProfilePic = localStorage.getItem('userProfilePic');
    if (savedProfilePic) {
        profilePicPreview.src = savedProfilePic;
    }

    // 0. Initialize Data
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('id');

    async function loadInitialData() {
        const companies = JSON.parse(localStorage.getItem('companies')) || [];
        if (editId !== null && companies[editId]) {
            await populateForm(companies[editId]);
            displayProfile(companies[editId]);
        }
    }
    loadInitialData();

    async function populateForm(data) {
        document.getElementById('company-name').value = data['company-name'];
        document.getElementById('reg-number').value = data['reg-number'];
        document.getElementById('description').value = data['description'];
        document.getElementById('company-email').value = data['company-email'];
        document.getElementById('website').value = data['website'] || '';
        document.getElementById('location').value = data['location'];
        document.getElementById('industry').value = data['industry'];
        document.getElementById('service-focus').value = data['service-focus'] || '';
        document.getElementById('hiring-preference').value = data['hiring-preference'];
        document.getElementById('payment-budget').value = data['payment-budget'] || '';
        document.getElementById('legality').value = data['legality'] || '';
        document.getElementById('contact-detail').value = data['contact-detail'];
        document.getElementById('portfolio').value = data['portfolio'] || '';

        // Load images from IndexedDB
        if (data['reg-number']) {
            const logo = await ImageDB.getImage(`logo_${data['reg-number']}`);
            if (logo) {
                logoPreviewImg.src = logo;
                logoPreviewImg.style.display = 'block';
                placeholderIcon.style.display = 'none';
            }

            const profilePic = await ImageDB.getImage(`profile_${data['reg-number']}`);
            if (profilePic) {
                profilePicPreview.src = profilePic;
            }
        }

        // Trigger character count
        description.dispatchEvent(new Event('input'));
    }



    // 1. Description Character Count
    description.addEventListener('input', function () {
        const count = this.value.length;
        charCurrent.textContent = count;
        if (count >= 500) {
            charCurrent.style.color = 'var(--danger-color)';
        } else {
            charCurrent.style.color = 'var(--text-muted)';
        }
    });

    // 2. Logo Upload & Preview
    logoUpload.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            // Validation: File Type (Only JPG/PNG)
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedTypes.includes(file.type)) {
                logoError.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Invalid file type. Please upload a JPG or PNG image.`;
                logoError.style.display = 'block';
                this.value = '';
                return;
            }
            logoError.style.display = 'none';
            // Validation: File Size removed as per requirement

            const reader = new FileReader();
            reader.onload = function (e) {
                logoPreviewImg.src = e.target.result;
                logoPreviewImg.style.display = 'block';
                placeholderIcon.style.display = 'none';
                errorContainer.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });

    // 2.1 Profile Picture Upload
    profilePicBtn.addEventListener('click', () => profilePicUpload.click());

    profilePicUpload.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                showError("Invalid file type. Please upload an image.");
                return;
            }
            const reader = new FileReader();
            reader.onload = function (e) {
                profilePicPreview.src = e.target.result;
                // Save to global persistence immediately
                localStorage.setItem('userProfilePic', e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    // 3. Form Submission Handling
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        errorContainer.style.display = 'none';

        const errors = [];
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Field Validation
        if (!data['company-name'].trim()) errors.push("Company Name is required.");

        // Registration Number: exactly 12 digits
        const regNum = data['reg-number'].trim();
        if (!regNum) {
            errors.push("Registration Number is required.");
        } else if (!/^\d{12}$/.test(regNum)) {
            errors.push("Registration Number must be exactly 12 digits.");
        }

        if (!data['description'].trim()) errors.push("Description is required.");
        if (data['description'].length > 500) errors.push("Description cannot exceed 500 characters.");

        // Email Validation: must contain '@' and '.com'
        const email = data['company-email'].trim();
        if (!email) {
            errors.push("Company Email is required.");
        } else if (!email.includes('@') || !email.toLowerCase().endsWith('.com')) {
            errors.push("Email must contain '@' and end with '.com'.");
        }

        if (!data['location']) errors.push("Location is required.");
        if (!data['industry']) errors.push("Industry is required.");
        if (!data['contact-detail'].trim()) errors.push("Contact Detail is required.");

        // Logo Validation (Manual check because required attribute doesn't show in FormData easily for files)
        if (!logoUpload.files[0]) {
            errors.push("Company Logo is required.");
        }

        // Uniqueness Checks (Fetch fresh data to avoid duplication bugs)
        const companies = JSON.parse(localStorage.getItem('companies')) || [];

        const isDuplicateReg = companies.some((comp, index) => {
            if (editId !== null && index == editId) return false;
            return comp['reg-number'] === data['reg-number'];
        });

        const isDuplicateEmail = companies.some((comp, index) => {
            if (editId !== null && index == editId) return false;
            return comp['company-email'].toLowerCase() === data['company-email'].toLowerCase();
        });

        if (isDuplicateReg) {
            errors.push("This Registration Number is already registered.");
        }
        if (isDuplicateEmail) {
            errors.push("This company email is already registered.");
        }

        if (errors.length > 0) {
            showError(errors.join("<br>"));

            // Highlight empty required fields
            const requiredFields = form.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                const isLogo = field.id === 'logo-upload';
                const target = isLogo ? document.querySelector('.logo-upload-container') : field;

                if (!field.value.trim() && (field.type !== 'file' || !field.files[0])) {
                    target.classList.add('error-input');

                    if (isLogo) {
                        // Specific listener for logo upload
                        const removeLogoError = () => {
                            if (field.files[0]) {
                                target.classList.remove('error-input');
                                field.removeEventListener('change', removeLogoError);
                            }
                        };
                        field.addEventListener('change', removeLogoError);
                    } else {
                        // Add listener to remove error when input changes
                        const removeError = function () {
                            if (this.value.trim()) {
                                target.classList.remove('error-input');
                                this.removeEventListener('input', removeError);
                            }
                        };
                        field.addEventListener('input', removeError);
                    }
                }
            });

            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // Include logo and profile pic in data
        data.logo = logoPreviewImg.src;
        data.profilePic = localStorage.getItem('userProfilePic') || profilePicPreview.src;

        // 4. Save to LocalStorage and Transform Form to Profile View
        try {
            // Store large images in IndexedDB instead of localStorage
            const regNumKey = data['reg-number'];
            await ImageDB.storeImage(`logo_${regNumKey}`, logoPreviewImg.src);
            await ImageDB.storeImage(`profile_${regNumKey}`, profilePicPreview.src);

            // Remove large strings from data before saving to localStorage
            delete data.logo;
            delete data.profilePic;

            if (editId !== null) {
                companies[editId] = data;
            } else {
                companies.push(data);
            }
            localStorage.setItem('companies', JSON.stringify(companies));
            displayProfile(data);
        } catch (error) {
            console.error("Storage error:", error);
            showError("Failed to save profile. There might be a technical issue with browser storage.");
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    function showError(msg) {
        errorContainer.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${msg}`;
        errorContainer.style.display = 'block';
    }

    async function displayProfile(data) {
        // Populate view fields
        document.getElementById('view-name').innerText = data['company-name'];
        document.getElementById('view-reg').innerText = data['reg-number'];
        document.getElementById('view-description').innerText = data['description'];
        document.getElementById('view-email').innerText = data['company-email'];
        document.getElementById('view-industry').innerText = data['industry'];
        document.getElementById('view-location').innerText = data['location'];
        document.getElementById('view-hiring').innerText = data['hiring-preference'];
        document.getElementById('view-budget').innerText = data['payment-budget'] || 'Not specified';
        document.getElementById('view-contact').innerText = data['contact-detail'];

        const websiteLink = document.getElementById('view-website');
        if (data['website']) {
            websiteLink.href = data['website'];
            websiteLink.innerText = data['website'];
            websiteLink.parentElement.style.display = 'block';
        } else {
            websiteLink.parentElement.style.display = 'none';
        }

        const legality = document.getElementById('view-legality');
        if (data['legality']) {
            legality.innerText = data['legality'];
            document.getElementById('view-legality-section').style.display = 'block';
        } else {
            document.getElementById('view-legality-section').style.display = 'none';
        }

        // Logo handle
        const viewLogo = document.getElementById('view-logo');
        const logo = await ImageDB.getImage(`logo_${data['reg-number']}`);
        viewLogo.src = logo || logoPreviewImg.src;

        // Switch screens
        formView.style.display = 'none';
        profileView.style.display = 'block';
        pageTitle.innerText = "Company Profile";
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    window.backToList = function () {
        window.location.href = 'CompanyAccount.html';
    };

    window.cancelCreate = function () {
        if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
            form.reset();
            // Clear previews
            logoPreviewImg.style.display = 'none';
            placeholderIcon.style.display = 'block';
            profilePicPreview.src = 'https://via.placeholder.com/60';
            window.location.href = 'CompanyAccount.html';
        }
    };
});
