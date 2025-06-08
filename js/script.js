document.addEventListener('DOMContentLoaded', () => {
    // Hamburger menu toggle for mobile
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking a nav link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetID = this.getAttribute('href');
            if (targetID.length > 1) { // Not empty or only #
                e.preventDefault();
                const targetElement = document.querySelector(targetID);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // Quote form submission handling
    const quoteForm = document.getElementById('quoteForm');
    if (quoteForm) {
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simple validation: check required fields
            const name = quoteForm.name.value.trim();
            const email = quoteForm.email.value.trim();
            const category = quoteForm.category.value;
            const message = quoteForm.message.value.trim();

            if (!name || !email || !category || !message) {
                alert('Please fill in all required fields.');
                return;
            }

            // Basic email format validation
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            // Simulate form submission success
            alert('Thank you, ' + name + '! Your quote request has been received. We will contact you shortly.');

            // Reset the form
            quoteForm.reset();
        });
    }
});

