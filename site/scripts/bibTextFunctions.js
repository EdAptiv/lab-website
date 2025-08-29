// --- (formatAuthors and renderPublication functions remain the same) ---
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

  const yearDiv = document.createElement("div");
  yearDiv.className = "publication-year";
  yearDiv.textContent = year;
  // publicationDiv.appendChild(yearDiv);

  const detailsDiv = document.createElement("div");
  detailsDiv.className = "publication-details";

  const titleSpan = document.createElement("span");
  titleSpan.className = "publication-title";
  titleSpan.innerHTML = title;
  detailsDiv.appendChild(titleSpan);

  const authorsDiv = document.createElement("div");
  authorsDiv.className = "publication-authors";
  authorsDiv.textContent = formatAuthors(authors);
  detailsDiv.appendChild(authorsDiv);

  const journalBooktitleDiv = document.createElement("div");
  if (journal) {
    journalBooktitleDiv.className = "publication-journal";
    journalBooktitleDiv.textContent = journal;
  } else if (booktitle) {
    journalBooktitleDiv.className = "publication-booktitle";
    journalBooktitleDiv.textContent = booktitle;
  }
  if (journal || booktitle) {
    detailsDiv.appendChild(journalBooktitleDiv);
  }

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
  if (doi) {
    const doiLink = document.createElement("a");
    doiLink.href = `https://doi.org/${doi}`;
    doiLink.textContent = "Link to paper";
    doiLink.target = "_blank";
    linksDiv.appendChild(doiLink);
  }
  if (linksDiv.children.length > 0) {
    detailsDiv.appendChild(linksDiv);
  }


  publicationDiv.appendChild(detailsDiv);

  return publicationDiv;
}

document.addEventListener("DOMContentLoaded", function () {
  const publicationsListDiv = document.getElementById("publications-list");

  // filepath: /Users/anniejohansson/Library/CloudStorage/OneDrive-UvA/EdAptiv/site/publications.html
  fetch("../publications.bib")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then((bibtexString) => {
      // Parse BibTeX using bibtex-parse-js
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
        if (!groupedByYear[year]) {
          groupedByYear[year] = [];
        }
        groupedByYear[year].push(entry);
      });

      // Sort years in descending order (newest first)
      const sortedYears = Object.keys(groupedByYear).sort((a, b) =>
        b.localeCompare(a)
      );

      // Render publications year by year
      publicationsListDiv.innerHTML = "";
      sortedYears.forEach((year) => {
        const yearHeading = document.createElement("h3");
        yearHeading.className = "text-xl font-bold text-[#527ED6] mt-8 mb-6"; // format heading for year here
        yearHeading.textContent = year;
        publicationsListDiv.appendChild(yearHeading);

        // Sort entries within each year (e.g., by title for consistency)
        groupedByYear[year].sort((a, b) =>
          (a.title || "").localeCompare(b.title || "")
        );

        groupedByYear[year].forEach((entry) => {
          publicationsListDiv.appendChild(renderPublication(entry));
        });
      });
    })
    .catch((error) => {
      console.error("Error fetching or processing BibTeX file:", error);
      publicationsListDiv.innerHTML = `<p class="text-red-500 text-center">Error loading publications: ${error.message}</p>`;
    });
});

