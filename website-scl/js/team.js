const API_BASE = "http://localhost:4300/api";

function getQueryParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
}

document.addEventListener("DOMContentLoaded", loadTeamPage);

async function loadTeamPage() {
    const teamId = getQueryParam("id");
    const nameEl = document.querySelector("#team-name");
    const statsEl = document.querySelector("#team-stats");
    const matchesEl = document.querySelector("#team-matches");

    if (!teamId) {
        nameEl.textContent = "Team not found.";
        statsEl.textContent = "";
        matchesEl.textContent = "";
        return;
    }

    try {
        const [teams, standings, matches] = await Promise.all([
            fetch(`${API_BASE}/teams`).then((r) => r.json()),
            fetch(`${API_BASE}/standings`).then((r) => r.json()),
            fetch(`${API_BASE}/matches`).then((r) => r.json())
        ]);

        const team = teams.find((t) => t.id == teamId);
        if (!team) {
            nameEl.textContent = "Team not found.";
            return;
        }

        nameEl.textContent = team.name;

        // random logo gradient
        const logo = document.querySelector(".team-logo-placeholder");
        const c1 = "#" + Math.floor(Math.random() * 16777215).toString(16);
        const c2 = "#" + Math.floor(Math.random() * 16777215).toString(16);
        logo.style.background = `linear-gradient(135deg, ${c1}, ${c2})`;

        // stats
        const stat = standings.find((s) => s.team === team.name);
        if (stat) {
            statsEl.innerHTML = `
                Played: ${stat.played}<br>
                Wins: ${stat.wins}<br>
                Draws: ${stat.draws}<br>
                Losses: ${stat.losses}<br>
                Goals For: ${stat.goalsFor}<br>
                Goals Against: ${stat.goalsAgainst}<br>
                Points: ${stat.points}
            `;
        } else {
            statsEl.textContent = "No stats available yet.";
        }

        // matches
        const teamMatches = matches.filter(
            (m) => m.homeTeam === team.name || m.awayTeam === team.name
        );

        if (teamMatches.length === 0) {
            matchesEl.textContent = "No matches found for this team.";
        } else {
            matchesEl.innerHTML = "";
            teamMatches.forEach((m) => {
                const div = document.createElement("div");
                div.className = "match-card";

                const score =
                    m.status === "COMPLETED" && m.scoreHome !== null
                        ? `${m.scoreHome} - ${m.scoreAway}`
                        : "TBD";

                div.innerHTML = `
                    <div>${m.homeTeam} vs ${m.awayTeam}</div>
                    <div>Matchday: ${m.matchday}</div>
                    <div>Status: ${m.status}</div>
                    <div>Score: ${score}</div>
                `;
                matchesEl.appendChild(div);
            });
        }
    } catch (err) {
        console.error("Error loading team page:", err);
        nameEl.textContent = "Error loading team.";
    }
}
