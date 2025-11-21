import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";

config();

const app = express();
const prisma = new PrismaClient();

const PORT = process.env.SCL_API_PORT || 4300;

app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "SCL API" });
});

/* ===========================================
   GET /api/teams  -> list of SCL teams
   =========================================== */
app.get("/api/teams", async (req, res) => {
  try {
    const teams = await prisma.sclTeam.findMany({
      orderBy: { name: "asc" }
    });

    res.json(teams);
  } catch (err) {
    console.error("Error fetching SCL teams:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* ===========================================
   GET /api/standings  -> standings with team names
   =========================================== */
app.get("/api/standings", async (req, res) => {
  try {
    const standings = await prisma.sclStanding.findMany({
      include: { team: true },
      orderBy: [
        { points: "desc" },
        { goalsFor: "desc" },
        { goalsAgainst: "asc" }
      ]
    });

    // Optional: map to cleaner payload
    const payload = standings.map((s, index) => ({
      position: index + 1,
      team: s.team.name,
      shortName: s.team.shortName,
      played: s.played,
      wins: s.wins,
      draws: s.draws,
      losses: s.losses,
      goalsFor: s.goalsFor,
      goalsAgainst: s.goalsAgainst,
      goalDifference: s.goalsFor - s.goalsAgainst,
      points: s.points
    }));

    res.json(payload);
  } catch (err) {
    console.error("Error fetching SCL standings:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* ===========================================
   GET /api/matches  -> list of matches
   =========================================== */
app.get("/api/matches", async (req, res) => {
  try {
    const matches = await prisma.sclMatch.findMany({
      include: {
        homeTeam: true,
        awayTeam: true
      },
      orderBy: [
        { matchday: "asc" },
        { id: "asc" }
      ]
    });

    const payload = matches.map((m) => ({
      id: m.id,
      matchday: m.matchday,
      homeTeam: m.homeTeam.name,
      awayTeam: m.awayTeam.name,
      scoreHome: m.scoreHome,
      scoreAway: m.scoreAway,
      status: m.status,
      scheduledAt: m.scheduledAt,
      toornamentMatchId: m.toornamentMatchId
    }));

    res.json(payload);
  } catch (err) {
    console.error("Error fetching SCL matches:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`SCL API running on http://localhost:${PORT}`);
});
