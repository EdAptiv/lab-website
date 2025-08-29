function formatAuthors(authorString) {
    if (!authorString) return "";
    authorString = authorString.replace(/{|}|\\url{.*?}/g, "").trim();

    let authors = authorString.split(/ and /i).map((name) => {
      name = name.trim();
      const commaIndex = name.indexOf(",");
      if (commaIndex !== -1) {
        const last = name.substring(0, commaIndex).trim();
        const first = name.substring(commaIndex + 1).trim();
        return `${first.charAt(0)}. ${last}`;
      } else {
        const parts = name.split(" ");
        if (parts.length > 1) {
          const last = parts.pop();
          const firstInitial = parts[0].charAt(0);
          return `${firstInitial}. ${last}`;
        }
        return name;
      }
    });

    if (authors.length > 2) {
      return (
        authors.slice(0, -1).join(", ") + ", and " + authors[authors.length - 1]
      );
    } else if (authors.length === 2) {
      return authors.join(" and ");
    } else {
      return authors[0];
    }
  }

function renderPublication(entry) {
    const publicationDiv = document.createElement("div");
    publicationDiv.className = "publication-item";

    const title = entry.TITLE || entry.title || "Untitled";
    const authors = entry.AUTHOR || entry.author || "";
    const year = entry.YEAR || entry.year || "N.D.";
    const journal = entry.JOURNAL || entry.journal;
    const booktitle = entry.BOOKTITLE || entry.booktitle;
    const url = entry.URL || entry.url;
    const doi = entry.DOI || entry.doi;
    const abstractText = entry.ABSTRACT || entry.abstract;

    // Details Column
    const detailsDiv = document.createElement("div");
    detailsDiv.className = "publication-details";

    // Create the title link
    const titleLink = document.createElement("a");
    titleLink.className = "publication-title-link";
    titleLink.innerHTML = title;
    
    // Set the link target from the DOI
    if (doi) {
        titleLink.href = `https://doi.org/${doi}`;
        titleLink.target = "_blank"; // Open in a new tab
    } else {
        // If no DOI, prevent the link from being clickable but keep the styling
        titleLink.href = "#";
        titleLink.onclick = (e) => e.preventDefault();
        titleLink.style.cursor = "default";
    }

    detailsDiv.appendChild(titleLink);

    // ... (rest of the elements for authors, journal, etc. remain the same) ...

    const authorsDiv = document.createElement("div");
    authorsDiv.className = "publication-authors";
    authorsDiv.textContent = formatAuthors(authors);
    detailsDiv.appendChild(authorsDiv);

    if (journal || booktitle) {
        const journalBooktitleDiv = document.createElement("div");
        journalBooktitleDiv.className = "publication-venue";
        journalBooktitleDiv.textContent = journal || booktitle;
        detailsDiv.appendChild(journalBooktitleDiv);
    }
    
    // Abstract button and content (this part is unchanged)
    if (abstractText) {
      const abstractToggle = document.createElement("button");
      abstractToggle.className = "publication-abstract-toggle";
      abstractToggle.textContent = "Abstract";
      detailsDiv.appendChild(abstractToggle);

      const abstractContent = document.createElement("p");
      abstractContent.className = "publication-abstract-content";
      abstractContent.textContent = abstractText;
      detailsDiv.appendChild(abstractContent);

      abstractToggle.onclick = function () {
        abstractContent.classList.toggle("open");
        abstractToggle.textContent = abstractContent.classList.contains("open")
          ? "Abstract (Hide)"
          : "Abstract";
      };
    }
    
    const linksDiv = document.createElement("div");
    linksDiv.className = "publication-links";
    if (url) {
      const pdfLink = document.createElement("a");
      pdfLink.href = url;
      pdfLink.textContent = "[PDF]";
      pdfLink.target = "_blank";
      linksDiv.appendChild(pdfLink);
    }
    if (linksDiv.children.length > 0) {
      detailsDiv.appendChild(linksDiv);
    }

    publicationDiv.appendChild(detailsDiv);

    return publicationDiv;
}

 document.addEventListener("DOMContentLoaded", function () {
    const publicationsListDiv = document.getElementById("publications-list");

    fetch("../publications.bib")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then((bibtexString) => {
            const entriesArray = BibtexParser.parseToJSON(bibtexString);

            if (!entriesArray || entriesArray.length === 0) {
                publicationsListDiv.innerHTML =
                    '<p class="text-red-500 text-center">No publications found. Check your BibTeX file format.</p>';
                return;
            }

            // Group publications by year
            const groupedByYear = {};
            entriesArray.forEach((entry) => {
                const year = entry.year || "No Year";
                if (!groupedByYear[year]) groupedByYear[year] = [];
                groupedByYear[year].push(entry);
            });

            const sortedYears = Object.keys(groupedByYear).sort((a, b) => b.localeCompare(a));

            publicationsListDiv.innerHTML = "";

            sortedYears.forEach((year) => {
                // Create a container for the year group with flexbox
                const yearGroupContainer = document.createElement("div");
                yearGroupContainer.className = "pubs-year-group-container"; // New class for flex container

                // Year Heading
                const yearHeading = document.createElement("div");
                yearHeading.className = "publication-year-group-label";
                yearHeading.textContent = year;
                yearGroupContainer.appendChild(yearHeading);

                // Publication Items Wrapper
                const itemsWrapper = document.createElement("div");
                itemsWrapper.className = "publication-items-wrapper";

                groupedByYear[year]
                    .sort((a, b) => (a.title || "").localeCompare(b.title || ""))
                    .forEach((entry) => {
                        itemsWrapper.appendChild(renderPublication(entry));
                    });

                yearGroupContainer.appendChild(itemsWrapper);
                publicationsListDiv.appendChild(yearGroupContainer);
            });
        })
        .catch((error) => {
            console.error("Error fetching or processing BibTeX file:", error);
            publicationsListDiv.innerHTML = `<p class="text-red-500 text-center">Error loading publications: ${error.message}</p>`;
        });
});