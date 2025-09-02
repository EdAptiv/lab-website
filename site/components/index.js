import HeaderComponent from './header/header.js';
import FooterComponent from './footer/footer.js';
customElements.define('header-component', HeaderComponent);
customElements.define('footer-component', FooterComponent);

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".member-card img").forEach(img => {
    // If no src or broken image
    img.onerror = () => {
      createInitialsPlaceholder(img);
    };
    if (!img.getAttribute("src")) {
      createInitialsPlaceholder(img);
    }
  });

  function createInitialsPlaceholder(img) {
    const name = img.dataset.name || "??";
    const initials = name.split(" ")
      .map(word => word[0]?.toUpperCase())
      .join("")
      .slice(0, 2);

    // Create placeholder element
    const placeholder = document.createElement("div");
    placeholder.textContent = initials;
    placeholder.className = "member-placeholder";

    // Match styles
    placeholder.style.width = img.width + "px";
    placeholder.style.height = img.height + "px";
    placeholder.style.display = "flex";
    placeholder.style.alignItems = "center";
    placeholder.style.justifyContent = "center";
    placeholder.style.borderRadius = "50%";
    placeholder.style.backgroundColor = "#527ED6";
    placeholder.style.color = "white";
    placeholder.style.fontSize = "2rem";
    placeholder.style.marginBottom = "1.4rem";

    img.replaceWith(placeholder);
  }
});
