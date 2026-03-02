document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('company-profile-form');
    const logoUpload = document.getElementById('logo-upload');
    const logoPreviewImg = document.getElementById('logo-preview-img');
    const placeholderIcon = document.getElementById('placeholder-icon');
    const description = document.getElementById('description');
    const charCurrent = document.getElementById('char-current');
    const errorContainer = document.getElementById('error-message-container');
    const formView = document.getElementById('form-view');
    const profileView = document.getElementById('profile-view');
    const pageTitle = document.getElementById('page-title');

    // 0. Initialize Data from LocalStorage
    let companies = JSON.parse(localStorage.getItem('companies')) || [];
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('id');

    if (editId !== null && companies[editId]) {
        populateForm(companies[editId]);
        pageTitle.innerText = "Edit Company Profile";
    }

    function populateForm(data) {
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

        if (data['logo']) {
            logoPreviewImg.src = data['logo'];
            logoPreviewImg.style.display = 'block';
            placeholderIcon.style.display = 'none';
        }

        // Trigger character count
        description.dispatchEvent(new Event('input'));
    }

    // Mock "existing" emails for uniqueness check (excluding current one if editing)
    const existingEmails = ['admin@google.com', 'hr@test.com', 'contact@startup.io'];

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
            // Validation: File Type
            if (!file.type.startsWith('image/')) {
                showError("Invalid file type. Please upload an image (JPG, PNG, GIF).");
                this.value = '';
                return;
            }
            // Validation: File Size (2MB)
            if (file.size > 2 * 1024 * 1024) {
                showError("File is too large. Max size is 2MB.");
                this.value = '';
                return;
            }

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

    // 3. Form Submission Handling
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        errorContainer.style.display = 'none';

        const errors = [];
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Field Validation
        if (!data['company-name'].trim()) errors.push("Company Name is required.");
        if (!data['reg-number'].trim()) errors.push("Registration Number is required.");
        if (!data['description'].trim()) errors.push("Description is required.");
        if (data['description'].length > 500) errors.push("Description cannot exceed 500 characters.");
        if (!data['company-email'].trim()) errors.push("Company Email is required.");
        if (!data['location']) errors.push("Location is required.");
        if (!data['industry'].trim()) errors.push("Industry is required.");
        if (!data['contact-detail'].trim()) errors.push("Contact Detail is required.");

        // Logo Validation (Manual check because required attribute doesn't show in FormData easily for files)
        if (!logoUpload.files[0]) {
            errors.push("Company Logo is required.");
        }

        // Email Uniqueness Check (Acceptance Criteria #6)
        if (existingEmails.includes(data['company-email'].toLowerCase())) {
            errors.push("This email address is already registered in our system.");
        }

        if (errors.length > 0) {
            showError(errors.join("<br>"));
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // Include logo in data
        data.logo = logoPreviewImg.src;

        // 4. Save to LocalStorage and Transform Form to Profile View
        if (editId !== null) {
            companies[editId] = data;
        } else {
            companies.push(data);
        }
        localStorage.setItem('companies', JSON.stringify(companies));

        displayProfile(data);
    });

    function showError(msg) {
        errorContainer.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${msg}`;
        errorContainer.style.display = 'block';
    }

    function displayProfile(data) {
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
        viewLogo.src = logoPreviewImg.src;

        // Switch screens
        formView.style.display = 'none';
        profileView.style.display = 'block';
        pageTitle.innerText = "Company Profile";
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    window.backToList = function () {
        window.location.href = 'CompanyAccount.html';
    };
});
