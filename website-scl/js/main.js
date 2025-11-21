// ======================================================
// SCL WEBSITE — LIVE API VERSION
// Fetches REAL data from http://localhost:4300/api/
// Falls back to mock data if API is empty
// ======================================================

const API_BASE = "http://localhost:4300/api";

// ======================================================
// FETCH HELPERS
// ======================================================
async function getJSON(endpoint) {
    try {
        const res = await fetch(`${API_BASE}${endpoint}`);
        if (!res.ok) throw new Error("API Error");
        const data = await res.json();
        return data;
    } catch (err) {
        console.error(`API failed: ${endpoint}`, err);
        return null;
    }
}

// ======================================================
// RENDER STANDINGS
// ======================================================
async function renderStandings() {
    const tableBody = document.querySelector("#standings-body");
    if (!tableBody) return;

    const standings = await getJSON("/standings");

    if (!standings || standings.length === 0) {
        tableBody.innerHTML = `
            <tr><td colspan="10" style="text-align:center; padding:20px;">
            No standings data found.
            </td></tr>`;
        return;
    }

    tableBody.innerHTML = "";

    standings.forEach((s) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${s.position}</td>
            <td>${s.team}</td>
            <td>${s.played}</td>
            <td>${s.wins}</td>
            <td>${s.draws}</td>
            <td>${s.losses}</td>
            <td>${s.goalsFor}</td>
            <td>${s.goalsAgainst}</td>
            <td>${s.goalDifference}</td>
            <td>${s.points}</td>
        `;

        tableBody.appendChild(row);
    });
}

// ======================================================
// RENDER MATCHES
// ======================================================
async function renderMatches() {
    const container = document.querySelector("#matches-container");
    if (!container) return;

    const matches = await getJSON("/matches");

    if (!matches || matches.length === 0) {
        container.innerHTML = `<p>No matches found.</p>`;
        return;
    }

    container.innerHTML = "";

    // Group by matchday
    const grouped = {};
    matches.forEach((m) => {
        if (!grouped[m.matchday]) grouped[m.matchday] = [];
        grouped[m.matchday].push(m);
    });

    // Render matchdays
    for (const matchday of Object.keys(grouped)) {
        const title = document.createElement("h2");
        title.textContent = `Matchday ${matchday}`;
        container.appendChild(title);

        grouped[matchday].forEach((m) => {
            const card = document.createElement("div");
            card.className = "match-card";

            const score =
                m.status === "COMPLETED"
                    ? `${m.scoreHome} - ${m.scoreAway}`
                    : "TBD";

            card.innerHTML = `
                <div class="match-team">${m.homeTeam} vs ${m.awayTeam}</div>
                <div class="match-status">${m.status}</div>
                <div class="match-status">Score: ${score}</div>
            `;

            container.appendChild(card);
        });
    }
}

// ======================================================
// RENDER TEAMS
// ======================================================
async function renderTeams() {
    const container = document.querySelector("#teams-container");
    if (!container) return;

    const teams = await getJSON("/teams");

    if (!teams || teams.length === 0) {
        container.innerHTML = `<p>No teams found.</p>`;
        return;
    }

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

    // Assign random gradient logos
    document.querySelectorAll(".team-logo-placeholder").forEach((logo) => {
        const c1 = "#" + Math.floor(Math.random()*16777215).toString(16);
        const c2 = "#" + Math.floor(Math.random()*16777215).toString(16);
        logo.style.background = `linear-gradient(135deg, ${c1}, ${c2})`;
    });
}

// ======================================================
// INIT — Run correct function depending on page
// ======================================================
document.addEventListener("DOMContentLoaded", () => {
    renderStandings();
    renderMatches();
    renderTeams();
});
