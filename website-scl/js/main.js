// ===============================================
// MOCK DATA FOR SCL WEBSITE (Demo for Toornament)
// ===============================================

// ---------- SAMPLE TEAMS ----------
const teams = [
    { id: 1, name: "VELOX", short: "VLX" },
    { id: 2, name: "Shadow Clan", short: "SHD" },
    { id: 3, name: "Frozen Elite", short: "FZE" },
    { id: 4, name: "Pulse Unit", short: "PLS" },
    { id: 5, name: "Team Nova", short: "NVA" }
];

// ---------- SAMPLE STANDINGS ----------
const standings = [
    { team: "VELOX", played: 3, w: 3, d: 0, l: 0, gf: 15, ga: 7 },
    { team: "Shadow Clan", played: 3, w: 2, d: 0, l: 1, gf: 11, ga: 9 },
    { team: "Frozen Elite", played: 3, w: 1, d: 1, l: 1, gf: 8, ga: 10 },
    { team: "Pulse Unit", played: 3, w: 1, d: 1, l: 1, gf: 6, ga: 7 },
    { team: "Team Nova", played: 3, w: 0, d: 0, l: 3, gf: 4, ga: 11 }
];

// Automatically calculate GD + points
standings.forEach((s) => {
    s.gd = s.gf - s.ga;
    s.points = s.w * 3 + s.d;
});


// ---------- SAMPLE MATCHES (Matchday 1) ----------
const matches = [
    {
        matchday: "Matchday 1",
        games: [
            {
                home: "VELOX",
                away: "Frozen Elite",
                date: "Jan 2, 2026",
                status: "Completed",
                score: "5 - 3"
            },
            {
                home: "Shadow Clan",
                away: "Pulse Unit",
                date: "Jan 2, 2026",
                status: "Completed",
                score: "4 - 2"
            },
            {
                home: "Team Nova",
                away: "VELOX",
                date: "Jan 3, 2026",
                status: "Upcoming",
                score: "TBD"
            }
        ]
    }
];


// ===============================================
// RENDER STANDINGS TABLE
// ===============================================

function renderStandings() {
    const tableBody = document.querySelector("#standings-body");
    if (!tableBody) return;

    tableBody.innerHTML = "";

    standings.forEach((s, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${s.team}</td>
            <td>${s.played}</td>
            <td>${s.w}</td>
            <td>${s.d}</td>
            <td>${s.l}</td>
            <td>${s.gf}</td>
            <td>${s.ga}</td>
            <td>${s.gd}</td>
            <td>${s.points}</td>
        `;

        tableBody.appendChild(row);
    });
}

// ===============================================
// RENDER MATCHES
// ===============================================

function renderMatches() {
    const container = document.querySelector("#matches-container");
    if (!container) return;

    container.innerHTML = "";

    matches.forEach((day) => {
        const title = document.createElement("h2");
        title.textContent = day.matchday;
        container.appendChild(title);

        day.games.forEach((g) => {
            const card = document.createElement("div");
            card.className = "match-card";

            card.innerHTML = `
                <div class="match-team">${g.home} vs ${g.away}</div>
                <div class="match-status">${g.status} – ${g.date}</div>
                <div class="match-status">Score: ${g.score}</div>
            `;

            container.appendChild(card);
        });
    });
}

// Run renderers if page matches
document.addEventListener("DOMContentLoaded", () => {
    renderStandings();
    renderMatches();
});
// ===============================================
// RENDER TEAMS
// ===============================================
function renderTeams() {
    const container = document.querySelector("#teams-container");
    if (!container) return;

    container.innerHTML = "";

    teams.forEach((t) => {
        const card = document.createElement("div");
        card.className = "team-card";

        card.innerHTML = `
            <div class="team-logo-placeholder"></div>
            <h3>${t.name}</h3>
        `;

        container.appendChild(card);
    });
}

// Run renderer
document.addEventListener("DOMContentLoaded", () => {
    renderStandings();
    renderMatches();
    renderTeams();
});

// Apply random gradients to team logos (makes mockup look more real)
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".team-logo-placeholder").forEach((logo) => {
        const color1 = "#" + Math.floor(Math.random()*16777215).toString(16);
        const color2 = "#" + Math.floor(Math.random()*16777215).toString(16);
        logo.style.background = `linear-gradient(135deg, ${color1}, ${color2})`;
    });
});
