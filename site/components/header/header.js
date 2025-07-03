class HeaderComponent extends HTMLElement {
    connectedCallback() {
        fetch('../../../site/components/header/header.html')
            .then(res => res.text())
            .then(html => {
                this.innerHTML = html;
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                } else {
                    console.error('Lucide library not loaded.');
                }
            });
    }
}
export default HeaderComponent;
