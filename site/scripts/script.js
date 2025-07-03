// Initialize Lucide icons
// This function needs to be called after the DOM is loaded and Lucide script is available.
// The Lucide CDN script itself often handles this, but calling it explicitly ensures it.
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
} else {
    console.error('Lucide library not loaded.');
}

// Function to attach mobile menu listeners (now called after header is loaded)
function attachMobileMenuListeners() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    // Removed Lucide icon references as they are no longer in header.html
    const menuIcon = mobileMenuButton.querySelector('.menu-icon');
    const closeIcon = mobileMenuButton.querySelector('.close-icon');
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

    if (mobileMenuButton && mobileMenu && menuIcon && closeIcon) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            menuIcon.classList.toggle('hidden');
            closeIcon.classList.toggle('hidden');
        });
    } else {
        console.warn('Mobile menu elements not found after header load.');
    }

    mobileNavItems.forEach(item => {
        item.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            menuIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
        });
    });
}

// Set current year in footer and load header when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Ensure this is only called once
    document.getElementById('current-year').textContent = new Date().getFullYear();
});





// Placeholder for form submission:
// The form in index.html has an onsubmit handler that shows an alert. For a real site,
// you'd replace this with actual form submission logic (e.g., using Fetch API
// to send data to a backend service like Formspree or Netlify Forms).
// Example of how you might handle form submission (uncomment and adapt if needed):
/*
const contactForm = document.querySelector('#contact form');
contactForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    // Here you would typically send this data to a backend or a form service
    console.log('Form Submitted!');
    console.log('Name:', name);
    console.log('Email:', email);
    // Display a custom message instead of alert()
    const formContainer = contactForm.closest('.bg-gray-50');
    const successMessage = document.createElement('p');
    successMessage.className = 'text-center text-green-600 font-semibold mt-4';
    successMessage.textContent = 'Thank you for your message! We will get back to you soon.';
    formContainer.appendChild(successMessage);

    contactForm.reset(); // Clear the form
});
*/
