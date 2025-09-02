class HeaderComponent extends HTMLElement {
    connectedCallback() {
        fetch('/lab-website/site/components/header/header.html')
            .then(res => res.text())
            .then(html => {
                this.innerHTML = html;

                // Lucide icons
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }

                // Wait until header is actually in the DOM
                const header = this.querySelector("header");
                if (!header) return;

                // Scroll listener
                window.addEventListener("scroll", () => {
                    if (window.scrollY > 50) {
                        header.classList.add("scrolled");
                    } else {
                        header.classList.remove("scrolled");
                    }
                });
            });
    }
}

export default HeaderComponent;
