// ======================================================
// SCL WEBSITE — LIVE API VERSION
// Fetches data from http://localhost:4300/api/
// ======================================================

const API_BASE = "http://localhost:4300/api";

// ---------- helper ----------
async function getJSON(endpoint) {
    try {
        const res = await fetch(`${API_BASE}${endpoint}`);
        if (!res.ok) throw new Error("API Error");
        return await res.json();
    } catch (err) {
        console.error(`API failed: ${endpoint}`, err);
        return null;
    }
}

// ======================================================
// STANDINGS
// ======================================================
async function renderStandings() {
    const tableBody = document.querySelector("#standings-body");
    if (!tableBody) return; // not on this page

    const standings = await getJSON("/standings");

    if (!standings || standings.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="10" style="text-align:center; padding:20px;">
                    No standings data found.
                </td>
            </tr>`;
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
// MATCHES + MATCHDAY FILTER
// ======================================================
async function renderMatches() {
    const container = document.querySelector("#matches-container");
    const selector = document.querySelector("#matchday-select");
    if (!container || !selector) return; // not on this page

    const matches = await getJSON("/matches");

    if (!matches || matches.length === 0) {
        container.innerHTML = `<p>No matches found.</p>`;
        return;
    }

    // build matchday list
    const matchdays = [...new Set(matches.map((m) => m.matchday))].sort(
        (a, b) => a - b
    );

    // populate dropdown only once
    if (selector.options.length === 1) {
        matchdays.forEach((md) => {
            const opt = document.createElement("option");
            opt.value = md;
            opt.textContent = `Matchday ${md}`;
            selector.appendChild(opt);
        });
    }

    // selected value
    const selected = selector.value;

    // refilter when user changes
    selector.onchange = () => renderMatches();

    const filtered =
        selected === "all"
            ? matches
            : matches.filter((m) => m.matchday == selected);

    const grouped = {};
    filtered.forEach((m) => {
        if (!grouped[m.matchday]) grouped[m.matchday] = [];
        grouped[m.matchday].push(m);
    });

    container.innerHTML = "";

    for (const matchday of Object.keys(grouped)) {
        const title = document.createElement("h2");
        title.textContent = `Matchday ${matchday}`;
        container.appendChild(title);

        grouped[matchday].forEach((m) => {
            const card = document.createElement("div");
            card.className = "match-card";

            const score =
                m.status === "COMPLETED" && m.scoreHome !== null
                    ? `${m.scoreHome} - ${m.scoreAway}`
                    : "TBD";

            card.innerHTML = `
                <div class="match-team">${m.homeTeam} vs ${m.awayTeam}</div>
                <div class="match-status">Status: ${m.status}</div>
                <div class="match-status">Score: ${score}</div>
            `;

            container.appendChild(card);
        });
    }
}

// ======================================================
// TEAMS (LIST) — CLICKABLE CARDS
// ======================================================
async function renderTeams() {
    const container = document.querySelector("#teams-container");
    if (!container) return; // not on this page

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

        // make card clickable -> team.html?id=TEAM_ID
        card.style.cursor = "pointer";
        card.onclick = () => {
            window.location.href = `team.html?id=${t.id}`;
        };

        container.appendChild(card);
    });

    // random gradients for logos
    document.querySelectorAll(".team-logo-placeholder").forEach((logo) => {
        const c1 = "#" + Math.floor(Math.random() * 16777215).toString(16);
        const c2 = "#" + Math.floor(Math.random() * 16777215).toString(16);
        logo.style.background = `linear-gradient(135deg, ${c1}, ${c2})`;
    });
}

// ======================================================
// INIT
// ======================================================
document.addEventListener("DOMContentLoaded", () => {
    renderStandings();
    renderMatches();
    renderTeams();
});
