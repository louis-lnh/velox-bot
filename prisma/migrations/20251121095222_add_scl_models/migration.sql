-- CreateTable
CREATE TABLE "SclTeam" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "shortName" TEXT,
    "tag" TEXT,
    "logoUrl" TEXT,
    "region" TEXT,
    "toornamentId" TEXT,
    "discordRoleId" TEXT,
    "discordChannelId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SclPlayer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "discordId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'PLAYER',
    "teamId" INTEGER NOT NULL,
    CONSTRAINT "SclPlayer_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "SclTeam" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SclMatch" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "matchday" INTEGER NOT NULL,
    "homeTeamId" INTEGER NOT NULL,
    "awayTeamId" INTEGER NOT NULL,
    "scheduledAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'PLANNED',
    "scoreHome" INTEGER,
    "scoreAway" INTEGER,
    "toornamentMatchId" TEXT,
    "reportedAt" DATETIME,
    CONSTRAINT "SclMatch_homeTeamId_fkey" FOREIGN KEY ("homeTeamId") REFERENCES "SclTeam" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SclMatch_awayTeamId_fkey" FOREIGN KEY ("awayTeamId") REFERENCES "SclTeam" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SclStanding" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "teamId" INTEGER NOT NULL,
    "played" INTEGER NOT NULL DEFAULT 0,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "draws" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "goalsFor" INTEGER NOT NULL DEFAULT 0,
    "goalsAgainst" INTEGER NOT NULL DEFAULT 0,
    "points" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "SclStanding_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "SclTeam" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "SclTeam_toornamentId_key" ON "SclTeam"("toornamentId");

-- CreateIndex
CREATE UNIQUE INDEX "SclStanding_teamId_key" ON "SclStanding"("teamId");
