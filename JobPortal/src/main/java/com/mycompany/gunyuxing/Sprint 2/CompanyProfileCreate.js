document.addEventListener('DOMContentLoaded', function() {
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

    // Mock "existing" emails for uniqueness check
    const existingEmails = ['admin@google.com', 'hr@test.com', 'contact@startup.io'];

    // 1. Description Character Count
    description.addEventListener('input', function() {
        const count = this.value.length;
        charCurrent.textContent = count;
        if (count >= 500) {
            charCurrent.style.color = 'var(--danger-color)';
        } else {
            charCurrent.style.color = 'var(--text-muted)';
        }
    });

    // 2. Logo Upload & Preview
    logoUpload.addEventListener('change', function() {
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
            reader.onload = function(e) {
                logoPreviewImg.src = e.target.result;
                logoPreviewImg.style.display = 'block';
                placeholderIcon.style.display = 'none';
                errorContainer.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });

    // 3. Form Submission Handling
    form.addEventListener('submit', function(e) {
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

        // 4. Transform Form to Profile View (Acceptance Criteria #1, #7)
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
});
