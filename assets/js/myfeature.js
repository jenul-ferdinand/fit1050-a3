/**
 * ! Contact Form Validation
 * 
 * This script validates a contact form with the following features:
 * - Checks for empty fields
 * - Validates email format
 * - Checks for SQL and XSS injections
 * - Validates name length and characters
 * - Validates message length
 * - Displays error messages
 * - Enables/disables the send button based on field completion
 * 
 * @author Jenul Ferdinand
 */
document.addEventListener('DOMContentLoaded', function() {

    // ! ======================================================================|
    // ! SETUP
    // ! ======================================================================|

    const form = document.getElementById('contact-form');
    const nameInput = document.getElementById('contact-name');
    const schoolInput = document.getElementById('contact-school');
    const emailInput = document.getElementById('contact-email');
    const msgInput = document.getElementById('contact-message');

    const sendBtn = document.getElementById('send-message-button');

    if (!form || !sendBtn) {
        console.error('Critical form elements not found!');
        return;
    }

    const inputs = [nameInput, schoolInput, emailInput, msgInput];
    const originalPlaceholders = {};

    // * Store original placeholders & setup "typing resets error"
    inputs.forEach(input => {
        originalPlaceholders[input.id] = input.placeholder;

        input.addEventListener('input', function () {
            clearError(input);
            toggleSendButton();
        })
    })

    // * Enable the button only when all fields are non-empty
    function toggleSendButton() {
        const allFilled = inputs.every(i => i.value.trim() !== '');
        sendBtn.disabled = !allFilled;
    }



    // ! ======================================================================|
    // ! HELPER METHODS
    // ! ======================================================================|

    /**
     * ? Set error
     * 
     * Sets the error state of the input field by changing its
     * border color and placeholder text.
     * 
     * @param {HTMLInputElement} input - The input field to set the error on.
     * @param {string} message - The error message to display.
     */
    function setError(input, message) {
        input.style.borderColor = 'red';
        input.value = '';
        input.placeholder = message;
    }

    /**
     * ? Clear error
     * 
     * Clears the error state of the input field by resetting its 
     * border color and placeholder.
     * 
     * @param {HTMLInputElement} input - The input field to clear the error from.
     */
    function clearError(input) {
        input.style.borderColor = '';
        input.placeholder = originalPlaceholders[input.id];
        input.placeholderColor = '';
    }


    /**
     * ? SQL injection checker
     * 
     * Checks for common SQL injection patterns in the input string.
     * 
     * @returns {boolean} - True if SQL injection patterns are found, false otherwise.
     */
    function hasSQLInjection(str) {
        return /(\b(SELECT|UPDATE|DELETE|INSERT|DROP|EXEC|UNION|CREATE|ALTER|TRUNCATE)\b)|['";-]/i
            .test(str);
    }
    
    /**
     * ? XSS injection checker
     * 
     * Checks for common XSS patterns in the input string.
     * 
     * @returns {boolean} - True if XSS patterns are found, false otherwise.
     */
    function hasXSSInjection(str) {
        return /<script|javascript:|on\w+=|alert\(|eval\(|document\.cookie/i
            .test(str);
    }

    /**
     * ? Valid name checker
     * 
     * Checks if the name contains only valid characters (letters, spaces, hyphens).
     * 
     * @returns {boolean} - True if the name is valid, false otherwise.
     */
    function isValidName(name) {
        return /^[a-zA-Z\s-]+$/.test(name);
    }



    // ! ======================================================================|
    // ! SUBMISSION VALIDATION
    // ! ======================================================================|

    // Industry-standard email regex
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // * On send click -> run validations
    /**
     * * On send click -> run validations -> send message
     * 
     * - This function is triggered when the send button is clicked.
     * - It validates the input fields and checks for SQL and XSS injections.
     * - If all validations pass, it alerts the user that the message was sent 
     * successfully.
     * 
     * @param {Event} e - The click event.
     */
    sendBtn.addEventListener('click', function(e) {
        e.preventDefault();

        // For each input, check:
        for (const input of inputs) {
            // Check if empty (won't happen because button is disabled anyway)
            if (input.value.trim() === '') {
                setError(input, `Provide your ${input.id.replace('contact-', '').replace('-', ' ')}`);
                input.focus();
                return;
            }

            // Check for SQL && XSS injection
            if (hasSQLInjection(input.value) || hasXSSInjection(input.value)) { 
                setError(input, 'Invalid characters detected');
                input.focus();
                return;
            }

            // Check for length of name
            if (input.id == "contact-name" && (input.value.length < 3 || input.value.length > 20)) {
                setError(input, 'Name must be between 3 and 20 characters');
                input.focus();
                return;
            }

            // Check for valid name characters
            if (input.id == "contact-name" && !isValidName(input.value)) {
                setError(input, 'Invalid name');

                input.focus();
                return;
            }

            // Check for length of message
            if (input.id == "contact-message" && (input.value.length < 10 || input.value.length > 500)) {
                setError(input, 'Message must be between 10 and 500 characters');
                input.focus();
                return;
            }
        }

        // Email format validation
        if (!emailPattern.test(emailInput.value.trim())) {
            setError(emailInput, 'Invalid email');
            emailInput.focus();
            return;
        }

        // All validations passed
        alert('Message sent successfully!');
        form.reset();
        inputs.forEach(clearError);
        toggleSendButton();
    });



    // Initial check (fields are empty so button is disabled)
    toggleSendButton();
});

