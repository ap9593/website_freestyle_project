document.addEventListener("DOMContentLoaded", () => {
  let currentPage = 1;
  const pageSize = 11;
  let totalResults = 0;
  let currentCategory = "general";
  let currentQuery = "";
  let currentSortBy = "relevance"; // default
  let apiKey = sessionStorage.getItem("newsApiKey");

  const featuredContainer = document.getElementById("featuredContainer");
  const homeLayout = document.getElementById("homeLayout");
  const queryInput = document.getElementById("queryInput");
  const searchBtn = document.getElementById("searchBtn");
  const newsContainer = document.getElementById("newsContainer");
  const fallbackImage = "https://dummyimage.com/400x200/cccccc/000000&text=No+Image";
  const categoryLinks = document.querySelectorAll(".category-link");
  const darkToggle = document.getElementById("darkModeToggle");

  darkToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const icon = darkToggle.querySelector("i");
    icon.classList.toggle("bi-moon-fill");
    icon.classList.toggle("bi-brightness-high-fill");
  });
  document.getElementById("logoLink").addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelector('.category-link[data-category="general"]').click();
  });

  if (!apiKey) {
    const modal = new bootstrap.Modal(document.getElementById("apiKeyModal"));
    modal.show();

    document.getElementById("saveApiKeyBtn").addEventListener("click", () => {
      const inputKey = document.getElementById("apiKeyInputModal").value.trim();
      if (inputKey) {
        sessionStorage.setItem("newsApiKey", inputKey);
        apiKey = inputKey;
        modal.hide();
        fetchWithSpinner(fetchNews); // start loading news after saving
      }
    });
  } else {
    fetchWithSpinner(fetchNews); // if key already saved in session
  }

  categoryLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      currentCategory = link.getAttribute("data-category");
      currentQuery = "";
      currentPage = 1;
      categoryLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
    });
  });


  const prevBtn = document.getElementById("prevPage");
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        fetchWithSpinner(fetchNews);
      }
    });
  }
  const nextBtn = document.getElementById("nextPage");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      currentPage++;
      fetchWithSpinner(fetchNews);
    });
  }

  async function fetchNews() {
    if (!apiKey) {
      newsContainer.innerHTML = "<p class='text-center text-danger'>Please enter your NewsAPI key.</p>";
      return;
    }

    let url = "";
    if (currentQuery) {
      url = `https://newsapi.org/v2/everything?q=${currentQuery}&language=en&sortBy=${currentSortBy}&pageSize=${pageSize}&page=${currentPage}&apiKey=${apiKey}`;
    } else if (currentCategory === "general") {
      url = `https://newsapi.org/v2/top-headlines?sources=cnn,abc-news,bbc-news&pageSize=${pageSize}&page=${currentPage}&apiKey=${apiKey}`;
    } else {
      url = `https://newsapi.org/v2/top-headlines?category=${currentCategory}&pageSize=${pageSize}&page=${currentPage}&apiKey=${apiKey}`;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.status !== "ok" || !data.articles) {
        newsContainer.innerHTML = "<p class='text-center text-danger'>No articles found.</p>";
        return;
      }

      totalResults = data.totalResults;
      displayArticles(data.articles);
      togglePagination();
    } catch (err) {
      console.error(err);
      newsContainer.innerHTML = "<p class='text-center text-danger'>Failed to fetch news.</p>";
    }
  }

  function displayArticles(articles) {
    newsContainer.innerHTML = "";

    articles.forEach(article => {
      const col = document.createElement("div");
      col.className = "col-md-4 mb-4";
      col.innerHTML = `
        <div class="card h-100 shadow-sm dark-card">
          <img src="${article.urlToImage || fallbackImage}" class="card-img-top" alt="News image">
          <div class="card-body">
            <h5 class="card-title">${article.title}</h5>
            <p class="card-meta text-muted small mb-2">
              ${article.source?.name || 'Unknown'} &bull; ${new Date(article.publishedAt).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric'
      })}
            </p>
            <p class="card-text">${article.description || ''}</p>
          </div>
          <div class="card-footer text-center">
            <a href="${article.url}" target="_blank" class="btn btn-sm btn-outline-primary mt-auto shadow-sm rounded-pill px-4">Read More</a>
          </div>
        </div>
      `;
      newsContainer.appendChild(col);
    });
  }

  function togglePagination() {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    const totalPages = Math.ceil(totalResults / pageSize);
    if (totalPages <= 1) return;

    const createPageItem = (label, page, isActive = false, isDisabled = false) => {
      const li = document.createElement("li");
      li.className = `page-item ${isActive ? "active" : ""} ${isDisabled ? "disabled" : ""}`;
      const a = document.createElement("a");
      a.className = "page-link";
      a.href = "#";
      a.innerHTML = label;
      a.addEventListener("click", (e) => {
        e.preventDefault();
        if (!isDisabled && currentPage !== page) {
          currentPage = page;
          fetchWithSpinner(fetchNews);
        }
      });
      li.appendChild(a);
      return li;
    };

    // Previous
    pagination.appendChild(createPageItem('<i class="bi bi-chevron-left"></i>', currentPage - 1, false, currentPage === 1));

    // Page numbers
    const maxVisible = 5;
    let start = Math.max(currentPage - Math.floor(maxVisible / 2), 1);
    let end = Math.min(start + maxVisible - 1, totalPages);

    if (end - start < maxVisible - 1) {
      start = Math.max(end - maxVisible + 1, 1);
    }

    for (let i = start; i <= end; i++) {
      pagination.appendChild(createPageItem(i, i, i === currentPage));
    }

    // Next
    pagination.appendChild(createPageItem('<i class="bi bi-chevron-right"></i>', currentPage + 1, false, currentPage === totalPages));

  }
});
