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
        if (!password.value) {
            showError(passwordError, 'Password is required.');
            isValid = false;
        } else if (password.value.length < 6) {
            showError(passwordError, 'Password must be at least 6 characters.');
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
