document.addEventListener("DOMContentLoaded", () => {
  setupNav();
  highlightActiveNav();
  initSclPage();
});

function setupNav() {
  const navToggle = document.querySelector(".nav-toggle");
  const appInner = document.querySelector(".app-inner");

  if (!navToggle || !appInner) return;

  navToggle.addEventListener("click", () => {
    appInner.classList.toggle("nav-open");
  });

  appInner.addEventListener("click", (e) => {
    if (!appInner.classList.contains("nav-open")) return;
    const nav = e.target.closest(".navbar");
    const menu = e.target.closest(".nav-links, .nav-cta, .nav-toggle");
    if (!nav || !menu) {
      appInner.classList.remove("nav-open");
    }
  });
}

function highlightActiveNav() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  const links = document.querySelectorAll(".nav-links a");

  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;
    if (path === "" && href === "index.html") {
      link.classList.add("active");
    } else if (href === path) {
      link.classList.add("active");
    }
  });
}

/**
 * Dummy-Daten für SCL – hier kannst du später dein eigenes System anbinden.
 */
const sclStandings = [
  { pos: 1, team: "VELOX Esports", tag: "VLX", gp: 5, w: 5, l: 0, pts: 15, diff: "+18" },
  { pos: 2, team: "EXO Esports", tag: "EXO", gp: 5, w: 4, l: 1, pts: 12, diff: "+9" },
  { pos: 3, team: "Nova Strike", tag: "NVS", gp: 5, w: 3, l: 2, pts: 9, diff: "+4" },
  { pos: 4, team: "Shadow Pulse", tag: "SHP", gp: 5, w: 2, l: 3, pts: 6, diff: "-2" },
  { pos: 5, team: "Lunar Drift", tag: "LND", gp: 5, w: 1, l: 4, pts: 3, diff: "-9" },
  { pos: 6, team: "Pixel Surge", tag: "PXL", gp: 5, w: 0, l: 5, pts: 0, diff: "-20" }
];

const sclMatches = [
  { matchday: 1, home: "VELOX Esports", away: "Pixel Surge", date: "2026-01-01", status: "Finished", score: "3 - 0" },
  { matchday: 1, home: "EXO Esports", away: "Lunar Drift", date: "2026-01-02", status: "Finished", score: "3 - 1" },
  { matchday: 1, home: "Nova Strike", away: "Shadow Pulse", date: "2026-01-03", status: "Finished", score: "2 - 3" },
  { matchday: 2, home: "VELOX Esports", away: "Lunar Drift", date: "2026-01-10", status: "Scheduled", score: "-" },
  { matchday: 2, home: "EXO Esports", away: "Shadow Pulse", date: "2026-01-11", status: "Scheduled", score: "-" },
  { matchday: 2, home: "Pixel Surge", away: "Nova Strike", date: "2026-01-12", status: "Scheduled", score: "-" }
];

function initSclPage() {
  const standingsBody = document.querySelector("#standings-body");
  const scheduleBody = document.querySelector("#schedule-body");

  if (!standingsBody && !scheduleBody) return;

  if (standingsBody) {
    standingsBody.innerHTML = sclStandings
      .map(
        (row) => `
      <tr>
        <td>${row.pos}</td>
        <td>${row.tag}</td>
        <td>${row.team}</td>
        <td>${row.gp}</td>
        <td>${row.w}</td>
        <td>${row.l}</td>
        <td>${row.pts}</td>
        <td>${row.diff}</td>
      </tr>
    `
      )
      .join("");
  }

  if (scheduleBody) {
    scheduleBody.innerHTML = sclMatches
      .map(
        (m) => `
      <tr>
        <td>MD ${m.matchday}</td>
        <td>${m.date}</td>
        <td>${m.home} vs ${m.away}</td>
        <td>${m.score}</td>
        <td>${m.status}</td>
      </tr>
    `
      )
      .join("");
  }
}
