document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Navbar background change on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            document.querySelector('.navbar').classList.add('bg-white', 'shadow');
        } else {
            document.querySelector('.navbar').classList.remove('bg-white', 'shadow');
        }
    });

    // Fade in elements on scroll
    const fadeElements = document.querySelectorAll('.fade-in');
    const fadeInOnScroll = function() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    };

    window.addEventListener('scroll', fadeInOnScroll);
    fadeInOnScroll(); // Initial check for elements in view

    // Form submission handling with validation
    const form = document.getElementById('consultationForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const name = form.querySelector('input[type="text"]').value;
            const email = form.querySelector('input[type="email"]').value;
            const phone = form.querySelector('input[type="tel"]').value;
            const insurance = form.querySelector('select[name="insurance"]').value;
            const message = form.querySelector('textarea').value;

            if (!name || !email || !phone || !insurance) {
                alert('Por favor, completa todos los campos requeridos, incluyendo tu seguro médico.');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Por favor, ingresa un correo electrónico válido.');
                return;
            }

            // Phone validation (basic)
            const phoneRegex = /^[\d\s-+()]{10,}$/;
            if (!phoneRegex.test(phone)) {
                alert('Por favor, ingresa un número de teléfono válido.');
                return;
            }

            // Collect form data
            const formData = {
                name,
                email,
                phone,
                insurance,
                message
            };

            // Here you would typically send this data to your server
            console.log('Form submitted:', formData);
            
            // Show success message with urgency
            const successMessage = document.createElement('div');
            successMessage.className = 'alert alert-success mt-3';
            successMessage.innerHTML = `
                <h4 class="alert-heading">¡Excelente decisión!</h4>
                <p>Nos pondremos en contacto contigo en las próximas 24 horas para programar tu consulta GRATUITA.</p>
                <hr>
                <p class="mb-0">¡Has dado el primer paso hacia una vida sin dolor!</p>
            `;
            
            form.reset();
            form.appendChild(successMessage);

            // Remove success message after 5 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 5000);
        });
    }

    // Form submission handler
    document.getElementById('bookingForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';
        
        // Gather form data
        const formData = {
            name: form.querySelector('[name="name"]').value,
            phone: form.querySelector('[name="phone"]').value,
            email: form.querySelector('[name="email"]').value,
            insurance: form.querySelector('[name="insurance"]').value,
            message: form.querySelector('[name="message"]').value,
            source: 'Landing Page Form'
        };

        try {
            const response = await fetch('https://n8n.klcdigitalsolutions.com/webhook/landingpage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Show success message
            const successAlert = document.createElement('div');
            successAlert.className = 'alert alert-success mt-3 animate__animated animate__fadeIn';
            successAlert.innerHTML = `
                <i class="fas fa-check-circle me-2"></i>
                ¡Gracias por contactarnos! Nos comunicaremos contigo pronto.
            `;
            form.appendChild(successAlert);

            // Reset form
            form.reset();

            // Remove success message after 5 seconds
            setTimeout(() => {
                successAlert.classList.remove('animate__fadeIn');
                successAlert.classList.add('animate__fadeOut');
                setTimeout(() => successAlert.remove(), 1000);
            }, 5000);

        } catch (error) {
            console.error('Error:', error);
            
            // Show error message
            const errorAlert = document.createElement('div');
            errorAlert.className = 'alert alert-danger mt-3 animate__animated animate__fadeIn';
            errorAlert.innerHTML = `
                <i class="fas fa-exclamation-circle me-2"></i>
                Lo sentimos, hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.
            `;
            form.appendChild(errorAlert);

            // Remove error message after 5 seconds
            setTimeout(() => {
                errorAlert.classList.remove('animate__fadeIn');
                errorAlert.classList.add('animate__fadeOut');
                setTimeout(() => errorAlert.remove(), 1000);
            }, 5000);
        } finally {
            // Restore button state
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    });

    // Add urgency countdown timer
    const addCountdownTimer = () => {
        const timerContainer = document.createElement('div');
        timerContainer.className = 'countdown-timer text-center mb-4';
        timerContainer.innerHTML = `
            <h4 class="text-danger">¡Oferta Especial!</h4>
            <p>Esta oferta termina en:</p>
            <div class="timer-display">
                <span id="hours">24</span>h 
                <span id="minutes">00</span>m 
                <span id="seconds">00</span>s
            </div>
        `;

        const bookingForm = document.querySelector('.booking-form');
        bookingForm.insertBefore(timerContainer, bookingForm.firstChild);

        // Set countdown
        let timeLeft = 24 * 60 * 60; // 24 hours in seconds

        const updateTimer = () => {
            const hours = Math.floor(timeLeft / 3600);
            const minutes = Math.floor((timeLeft % 3600) / 60);
            const seconds = timeLeft % 60;

            document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');

            if (timeLeft > 0) {
                timeLeft--;
            }
        };

        updateTimer();
        setInterval(updateTimer, 1000);
    };

    addCountdownTimer();
});
