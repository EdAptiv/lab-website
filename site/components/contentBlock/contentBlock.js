class ContentBlockComponent extends HTMLElement {
    connectedCallback() {
        fetch('../../../site/components/contentBlock/contentBlock.html')
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
export default ContentBlockComponent;