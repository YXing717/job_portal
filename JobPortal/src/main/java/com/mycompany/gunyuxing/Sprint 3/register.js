document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const successOverlay = document.getElementById('successOverlay');
    
    // Form fields
    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');

    // Error message elements
    const fullNameError = document.getElementById('fullNameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');

    // Toggle password visibility
    const togglePasswordBtn = document.getElementById('togglePasswordBtn');
    const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPasswordBtn');

    const eyeOpenSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
    const eyeClosedSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;

    const toggleVisibility = (inputField, btn) => {
        if (inputField.type === 'password') {
            inputField.type = 'text';
            btn.innerHTML = eyeClosedSvg;
        } else {
            inputField.type = 'password';
            btn.innerHTML = eyeOpenSvg;
        }
    };

    togglePasswordBtn.addEventListener('click', () => toggleVisibility(password, togglePasswordBtn));
    toggleConfirmPasswordBtn.addEventListener('click', () => toggleVisibility(confirmPassword, toggleConfirmPasswordBtn));

    const showError = (element, message) => {
        element.textContent = message;
        element.classList.add('visible');
    };

    const hideError = (element) => {
        element.classList.remove('visible');
    };

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        // Reset errors
        [fullNameError, emailError, passwordError, confirmPasswordError].forEach(hideError);

        // Name Validation
        if (!fullName.value.trim()) {
            showError(fullNameError, 'Full name is required.');
            isValid = false;
        }

        // Email Validation
        if (!email.value.trim()) {
            showError(emailError, 'Email address is required.');
            isValid = false;
        } else if (!validateEmail(email.value.trim())) {
            showError(emailError, 'Please enter a valid email address.');
            isValid = false;
        } else {
            // Uniqueness Check
            const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            if (users.some(u => u.email === email.value.trim())) {
                showError(emailError, 'This email is already registered.');
                isValid = false;
            }
        }

        // Password Validation
        const hasLetter = /[a-zA-Z]/.test(password.value);
        const hasNumber = /[0-9]/.test(password.value);
        const hasSpecial = /[^A-Za-z0-9]/.test(password.value);

        if (!password.value) {
            showError(passwordError, 'Password is required.');
            isValid = false;
        } else if (password.value.length < 8) {
            showError(passwordError, 'Password must be at least 8 characters.');
            isValid = false;
        } else if (!hasLetter || !hasNumber || !hasSpecial) {
            showError(passwordError, 'Password must include at least 1 letter, 1 number, and 1 special character.');
            isValid = false;
        }

        // Confirm Password Validation
        if (confirmPassword.value !== password.value) {
            showError(confirmPasswordError, 'Passwords do not match.');
            isValid = false;
        }

        if (isValid) {
            // Register User
            const newUser = {
                fullName: fullName.value.trim(),
                email: email.value.trim(),
                password: password.value, // In a real app, this would be hashed on the server
                registeredAt: new Date().toISOString()
            };

            const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            users.push(newUser);
            localStorage.setItem('registeredUsers', JSON.stringify(users));

            // Show Success UI
            successOverlay.classList.add('visible');
        }
    });

    // Real-time validation (optional but nice for premium feel)
    fullName.addEventListener('input', () => hideError(fullNameError));
    email.addEventListener('input', () => hideError(emailError));
    password.addEventListener('input', () => {
        hideError(passwordError);
        if (confirmPassword.value) {
            if (confirmPassword.value !== password.value) {
                showError(confirmPasswordError, 'Passwords do not match.');
            } else {
                hideError(confirmPasswordError);
            }
        }
    });
    confirmPassword.addEventListener('input', () => {
        if (confirmPassword.value !== password.value) {
            showError(confirmPasswordError, 'Passwords do not match.');
        } else {
            hideError(confirmPasswordError);
        }
    });
});
