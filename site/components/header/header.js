class HeaderComponent extends HTMLElement {
    connectedCallback() {
        fetch('/lab-website/site/components/header/header.html')
            .then(res => res.text())
            .then(html => {
                this.innerHTML = html;

                // Initialize lucide icons
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                } else {
                    console.error('Lucide library not loaded.');
                }

                // Scroll listener for header
                const header = this.querySelector('header');
                window.addEventListener('scroll', () => {
                    if (window.scrollY > 50) { // adjust trigger point
                        header.classList.add('scrolled');
                    } else {
                        header.classList.remove('scrolled');
                    }
                });
            });
    }
}
export default HeaderComponent;
