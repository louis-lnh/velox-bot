const API_BASE = "http://localhost:4300/api";

// Helper
function getQueryParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
}

// Load team page
document.addEventListener("DOMContentLoaded", loadTeamPage);

async function loadTeamPage() {
    const teamId = getQueryParam("id");
    if (!teamId) {
        document.querySelector("#team-name").textContent = "Team not found.";
        return;
    }

    // Fetch all data in parallel
    const [teams, standings, matches] = await Promise.all([
        fetch(`${API_BASE}/teams`).then(r => r.json()),
        fetch(`${API_BASE}/standings`).then(r => r.json()),
        fetch(`${API_BASE}/matches`).then(r => r.json()),
    ]);

    const team = teams.find(t => t.id == teamId);
    if (!team) return;

    document.querySelector("#team-name").textContent = team.name;

    // Apply random logo
    const logo = document.querySelector(".team-logo-placeholder");
    const c1 = "#" + Math.floor(Math.random()*16777215).toString(16);
    const c2 = "#" + Math.floor(Math.random()*16777215).toString(16);
    logo.style.background = `linear-gradient(135deg, ${c1}, ${c2})`;

    // Stats
    const stat = standings.find(s => s.team === team.name);
    document.querySelector("#team-stats").innerHTML = stat ? `
        Played: ${stat.played}<br>
        Wins: ${stat.wins}<br>
        Draws: ${stat.draws}<br>
        Losses: ${stat.losses}<br>
        Goals For: ${stat.goalsFor}<br>
        Goals Against: ${stat.goalsAgainst}<br>
        Points: ${stat.points}<br>
    ` : "No stats available.";

    // Matches
    const teamMatches = matches.filter(m =>
        m.homeTeam === team.name || m.awayTeam === team.name
    );

    const container = document.querySelector("#team-matches");
    container.innerHTML = "";

    teamMatches.forEach(m => {
        const div = document.createElement("div");
        div.className = "match-card";
        div.innerHTML = `
            <div>${m.homeTeam} vs ${m.awayTeam}</div>
            <div>Matchday: ${m.matchday}</div>
            <div>Status: ${m.status}</div>
            <div>Score: ${m.scoreHome !== null ? `${m.scoreHome} - ${m.scoreAway}` : "TBD"}</div>
        `;
        container.appendChild(div);
    });

    // Players (currently we haven't added players to DB yet)
    document.querySelector("#player-list").innerHTML = `
        <li>No roster added yet.</li>
    `;
}
