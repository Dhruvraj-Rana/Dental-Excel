// Firebase configuration and initialization
// No need to require dotenv - we'll use the config from firebase-config.js

// Initialize Firebase should already be done in index.html
console.log("Appointment.js loaded");

// Initialize Firestore
const db = firebase.firestore();
const appointmentsCollection = db.collection('appointments');

// DOM Elements
const appointmentForm = document.getElementById('appointment-form');
const fullNameInput = document.getElementById('full-name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const dateInput = document.getElementById('appointment-date');
const timeInput = document.getElementById('appointment-time');
const serviceInput = document.getElementById('service');
const messageInput = document.getElementById('message');
const submitButton = document.getElementById('submit-appointment');
const successMessage = document.getElementById('success-message');
const errorMessage = document.getElementById('error-message');

// Generate time slots (9 AM to 5 PM)
const generateTimeSlots = () => {
    const startHour = 9; // 9 AM
    const endHour = 17; // 5 PM
    const interval = 30; // 30 minute intervals
    
    for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += interval) {
            const formattedHour = hour % 12 || 12; // Convert to 12-hour format
            const period = hour < 12 ? 'AM' : 'PM';
            const formattedMinute = minute === 0 ? '00' : minute;
            const timeSlot = `${formattedHour}:${formattedMinute} ${period}`;
            
            const option = document.createElement('option');
            option.value = timeSlot;
            option.textContent = timeSlot;
            timeInput.appendChild(option);
        }
    }
    console.log("Time slots added to the form");
};

// Handle form submission
if (appointmentForm) {
    appointmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log("Form submitted", { fullName: fullNameInput.value });
        
        // Show loading state
        submitButton.classList.add('loading');
        submitButton.disabled = true;
        
        // Validate form
        if (!validateForm()) {
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
            return;
        }
        
        try {
            const appointmentData = {
                fullName: fullNameInput.value,
                email: emailInput.value,
                phone: phoneInput.value,
                date: dateInput.value,
                time: timeInput.value,
                service: serviceInput.value,
                message: messageInput.value,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'pending'
            };
            
            // Check if the time slot is available
            const isAvailable = await checkAvailability(appointmentData.date, appointmentData.time);
            console.log(`Checking availability for ${appointmentData.date} at ${appointmentData.time}: ${isAvailable ? 'Available' : 'Not available'}`);
            
            if (!isAvailable) {
                showError('This time slot is no longer available. Please choose another time.');
                submitButton.classList.remove('loading');
                submitButton.disabled = false;
                return;
            }
            
            // Save to Firebase
            await appointmentsCollection.add(appointmentData);
            console.log("Appointment saved to Firebase");
            
            // Show success message
            showSuccess('Your appointment has been booked successfully! We will contact you soon to confirm.');
            
            // Reset form
            appointmentForm.reset();
            
            // Add success animation to form
            appointmentForm.classList.add('booking-success');
            setTimeout(() => {
                appointmentForm.classList.remove('booking-success');
            }, 2000);
            
        } catch (error) {
            console.error('Error booking appointment:', error);
            showError('There was a problem booking your appointment. Please try again later.');
        } finally {
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
        }
    });
}

// Check if the requested time slot is available
async function checkAvailability(date, time) {
    try {
        const snapshot = await appointmentsCollection
            .where('date', '==', date)
            .where('time', '==', time)
            .get();
        
        return snapshot.empty; // If empty, the time slot is available
    } catch (error) {
        console.error('Error checking availability:', error);
        return false; // Assume not available on error to prevent double booking
    }
}

// Form validation
function validateForm() {
    let isValid = true;
    
    // Reset previous error states
    const formGroups = appointmentForm.querySelectorAll('.form-group');
    formGroups.forEach(group => group.classList.remove('error'));
    
    // Validate full name (required)
    if (!fullNameInput.value.trim()) {
        markAsError(fullNameInput, 'Please enter your full name');
        isValid = false;
    }
    
    // Validate email (required and format)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim()) {
        markAsError(emailInput, 'Please enter your email address');
        isValid = false;
    } else if (!emailRegex.test(emailInput.value.trim())) {
        markAsError(emailInput, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate phone (required and at least 10 digits)
    const phoneValue = phoneInput.value.replace(/\D/g, '');
    if (!phoneValue) {
        markAsError(phoneInput, 'Please enter your phone number');
        isValid = false;
    } else if (phoneValue.length < 10) {
        markAsError(phoneInput, 'Please enter a valid phone number (at least 10 digits)');
        isValid = false;
    }
    
    // Validate date (required)
    if (!dateInput.value) {
        markAsError(dateInput, 'Please select an appointment date');
        isValid = false;
    }
    
    // Validate time (required)
    if (!timeInput.value) {
        markAsError(timeInput, 'Please select an appointment time');
        isValid = false;
    }
    
    // Validate service (required)
    if (!serviceInput.value) {
        markAsError(serviceInput, 'Please select a service');
        isValid = false;
    }
    
    return isValid;
}

// Mark form field as error
function markAsError(inputElement, message) {
    const formGroup = inputElement.closest('.form-group');
    formGroup.classList.add('error');
    
    // Add error message if it doesn't exist
    if (!formGroup.querySelector('.error-feedback')) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-feedback';
        errorElement.textContent = message;
        formGroup.appendChild(errorElement);
    } else {
        formGroup.querySelector('.error-feedback').textContent = message;
    }
}

// Show success message
function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.classList.add('animate-status');
    errorMessage.classList.remove('animate-status');
    
    setTimeout(() => {
        successMessage.classList.remove('animate-status');
    }, 5000);
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('animate-status');
    successMessage.classList.remove('animate-status');
    
    setTimeout(() => {
        errorMessage.classList.remove('animate-status');
    }, 5000);
}

// Set minimum date to today
function setMinDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    dateInput.min = `${year}-${month}-${day}`;
    console.log(`Set minimum date to: ${dateInput.min}`);
}

// Form interaction enhancements
function enhanceFormInteraction() {
    // Focus effects
    const formInputs = appointmentForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.closest('.form-group').classList.add('input-focused');
        });
        
        input.addEventListener('blur', () => {
            input.closest('.form-group').classList.remove('input-focused');
            
            // Add filled class if input has value
            if (input.value.trim()) {
                input.closest('.form-group').classList.add('input-filled');
            } else {
                input.closest('.form-group').classList.remove('input-filled');
            }
        });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (appointmentForm) {
        generateTimeSlots();
        setMinDate();
        enhanceFormInteraction();
    }
}); 