# 🌐 Global News Explorer

GlobeScope  is a responsive, user-friendly news web application that fetches real-time articles from the [NewsAPI](https://newsapi.org/) and presents them with features like category browsing, country-based filtering, dark mode, search functionality, and a carousel for top headlines.

---

Project Structure

```
/assets         → Logo images and static assets
/css            → External stylesheets
/js             → JavaScript logic and API interaction
index.html      → Main HTML structure
style.css       → Main stylesheet
script.js       → API calls, dynamic rendering, dark mode, pagination, etc.
```

---

Features Implemented

- ✅ Responsive design using **Bootstrap 5**
- ✅ **Top headlines carousel** with auto-play and manual controls
- ✅ News **category filtering** (business, sports, tech, etc.)
- ✅ **Search by keyword** with "Enter" key support
- ✅ **Sort by** relevance, popularity, or newest
- ✅ **Country selection** via fixed globe icon
- ✅ Smooth **fade-in animation** on article loads
- ✅ **Dark mode** toggle (with persistent layout support)
- ✅ Pagination for browsing large sets of results
- ✅ Mobile-friendly interface with adaptive components

---

How to Run the Project

1. **Clone or download** this repository.
2. Open `index.html` in any modern browser.
3. On first load, enter your personal NewsAPI key (from [newsapi.org](https://newsapi.org/)) when prompted.
4. Start browsing by category, searching, or filtering by country.

---

Prerequisites

- A valid **NewsAPI key** – Get one for free from [newsapi.org](https://newsapi.org/)
  - Sign up for an account.
  - Navigate to your dashboard and copy your API key.
  - On first load of the app, you will be prompted to paste this key.
- Internet access to load API content and CDN dependencies

---

Customization & Styling

- All styles are written in `style.css`.
- Carousel, cards, navbar, and pagination are styled with custom Bootstrap-based classes.
- Dark mode toggles class `.dark-mode` on `<body>` to switch themes.

License

This project has been created using the help of ChatGPT-4o and is created for educational and non-commercial purposes only.