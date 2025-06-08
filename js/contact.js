// Contact Form JavaScript Functionality

// DOM Elements
const contactForm = document.getElementById('contactForm');
const modal = document.getElementById('messageModal');
const closeModal = document.querySelector('.close');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Form validation patterns
const validationPatterns = {
    name: /^[a-zA-Z\s]{2,50}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[\d\s\+\-\(\)]{10,15}$/
};

// Error messages
const errorMessages = {
    name: 'Please enter a valid name (2-50 characters, letters only)',
    email: 'Please enter a valid email address',
    phone: 'Please enter a valid phone number (10-15 digits)',
    subject: 'Please select a subject',
    message: 'Please enter a message (minimum 10 characters)'
};

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    initializeNavigation();
    initializeAnimations();
    initializeEnhancedFeatures();
});

// Form initialization
function initializeForm() {
    // Add real-time validation
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearError(input));
    });

    // Form submission
    contactForm.addEventListener('submit', handleFormSubmit);
}

// Navigation functionality
function initializeNavigation() {
    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(44, 62, 80, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)';
            header.style.backdropFilter = 'none';
        }
    });
}

// Animation initialization
function initializeAnimations() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.contact-card, .form-left, .form-right');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Field validation
function validateField(field) {
    const fieldName = field.name;
    const fieldValue = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Clear previous errors
    clearError(field);

    // Required field check
    if (field.required && !fieldValue) {
        isValid = false;
        errorMessage = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    // Pattern validation
    else if (fieldValue && validationPatterns[fieldName] && !validationPatterns[fieldName].test(fieldValue)) {
        isValid = false;
        errorMessage = errorMessages[fieldName];
    }
    // Custom validations
    else if (fieldName === 'message' && fieldValue && fieldValue.length < 10) {
        isValid = false;
        errorMessage = errorMessages.message;
    }
    else if (fieldName === 'subject' && field.required && !fieldValue) {
        isValid = false;
        errorMessage = errorMessages.subject;
    }

    if (!isValid) {
        showError(field, errorMessage);
    }

    return isValid;
}

// Show field error
function showError(field, message) {
    field.classList.add('error');
    field.style.borderColor = '#e74c3c';
    
    const errorElement = document.getElementById(field.name + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

// Clear field error
function clearError(field) {
    field.classList.remove('error');
    field.style.borderColor = '#e0e0e0';
    
    const errorElement = document.getElementById(field.name + 'Error');
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

// Form submission handler
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validate all fields
    const formData = new FormData(contactForm);
    const inputs = contactForm.querySelectorAll('input[required], select[required], textarea[required]');
    let isFormValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });
    
    if (!isFormValid) {
        showModal('error', 'Validation Error', 'Please correct the errors in the form and try again.');
        return;
    }
    
    // Show loading state
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showModal('success', 'Message Sent!', 'Thank you for contacting JB Enterprise. We will get back to you within 24 hours.');
        
        // Reset form
        contactForm.reset();
        
        // Clear any remaining errors
        const errorElements = contactForm.querySelectorAll('.error-message');
        errorElements.forEach(el => {
            el.textContent = '';
            el.style.display = 'none';
        });
        
        const fields = contactForm.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            field.style.borderColor = '#e0e0e0';
            field.classList.remove('error');
        });
        
    }, 2000); // 2 second delay to simulate network request
}

// Modal functionality
function showModal(type, title, message) {
    const modalIcon = document.getElementById('modalIcon');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    
    // Set modal content based on type
    if (type === 'success') {
        modalIcon.innerHTML = '<i class="fas fa-check-circle" style="color: #27ae60;"></i>';
    } else {
        modalIcon.innerHTML = '<i class="fas fa-exclamation-circle" style="color: #e74c3c;"></i>';
    }
    
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    
    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Modal close functionality
if (closeModal) {
    closeModal.addEventListener('click', closeModalHandler);
}

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModalHandler();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        closeModalHandler();
    }
});

function closeModalHandler() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Enhanced form features
function initializeEnhancedFeatures() {
    // Auto-resize textarea
    const textarea = document.getElementById('message');
    if (textarea) {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    }
    
    // Character counter for message
    const messageField = document.getElementById('message');
    if (messageField) {
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.style.cssText = 'text-align: right; font-size: 0.8rem; color: #666; margin-top: 5px;';
        messageField.parentNode.appendChild(counter);
        
        messageField.addEventListener('input', function() {
            const current = this.value.length;
            const max = 500; // Set a reasonable max
            counter.textContent = `${current}/${max} characters`;
            
            if (current > max) {
                counter.style.color = '#e74c3c';
                this.value = this.value.substring(0, max);
            } else {
                counter.style.color = '#666';
            }
        });
    }
    
    // Phone number formatting
    const phoneField = document.getElementById('phone');
    if (phoneField) {
        phoneField.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length >= 10) {
                value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
            }
            this.value = value;
        });
    }
}

// Loading animation for page
window.addEventListener('load', function() {
    const loader = document.querySelector('.page-loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
});

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add smooth animations on scroll
function addScrollAnimations() {
    const cards = document.querySelectorAll('.contact-card');
    const features = document.querySelectorAll('.feature');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.2 });
    
    [...cards, ...features].forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', addScrollAnimations);

// Add floating effect to contact cards
function addFloatingEffect() {
    const cards = document.querySelectorAll('.contact-card');
    
    cards.forEach((card, index) => {
        // Add random floating animation
        const duration = 3 + Math.random() * 2; // 3-5 seconds
        const delay = index * 0.5; // Stagger the animations
        
        card.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
    });
    
    // Add the floating keyframes to CSS dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
    `;
    document.head.appendChild(style);
}

// Initialize floating effect
document.addEventListener('DOMContentLoaded', addFloatingEffect);

// Export functions for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateField,
        showModal,
        closeModalHandler
    };
}

