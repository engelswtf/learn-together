import { createServer, IncomingMessage, ServerResponse } from "http";
import { parse } from "url";
import next from "next";
import { Server as SocketIOServer } from "socket.io";
import * as fs from "fs";
import * as path from "path";

const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Progress data directory
const DATA_DIR = path.join(process.cwd(), "data", "progress");

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Sanitize player name for filename
function sanitizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\-_]/g, "_")
    .substring(0, 50);
}

// Get progress file path for a player
function getProgressPath(playerName: string): string {
  return path.join(DATA_DIR, `${sanitizeName(playerName)}.json`);
}

// Default progress structure
interface TopicProgress {
  topicId: string;
  flashcards: {
    totalStudied: number;
    totalKnown: number;
    totalUnknown: number;
    lastStudied: string | null;
    sessionsCompleted: number;
    bestKnownPercentage: number;
  };
  quiz: {
    totalAttempts: number;
    totalCorrect: number;
    totalIncorrect: number;
    lastAttempted: string | null;
    bestScore: number;
    bestPercentage: number;
    averagePercentage: number;
  };
}

interface OverallProgress {
  totalFlashcardsStudied: number;
  totalQuizAttempts: number;
  totalStudyTime: number;
  lastActive: string | null;
  streakDays: number;
  lastStreakDate: string | null;
  duelGamesPlayed: number;
  duelGamesWon: number;
  raceGamesPlayed: number;
  raceGamesWon: number;
}

interface ProgressData {
  playerName: string;
  topics: Record<string, TopicProgress>;
  overall: OverallProgress;
}

function createDefaultProgress(playerName: string): ProgressData {
  return {
    playerName,
    topics: {},
    overall: {
      totalFlashcardsStudied: 0,
      totalQuizAttempts: 0,
      totalStudyTime: 0,
      lastActive: null,
      streakDays: 0,
      lastStreakDate: null,
      duelGamesPlayed: 0,
      duelGamesWon: 0,
      raceGamesPlayed: 0,
      raceGamesWon: 0,
    },
  };
}

// Load progress for a player
function loadProgress(playerName: string): { progress: ProgressData; isReturning: boolean } {
  ensureDataDir();
  const filePath = getProgressPath(playerName);

  if (fs.existsSync(filePath)) {
    try {
      const data = fs.readFileSync(filePath, "utf-8");
      const progress = JSON.parse(data) as ProgressData;
      // Ensure new fields exist (migration)
      if (progress.overall.duelGamesPlayed === undefined) {
        progress.overall.duelGamesPlayed = 0;
        progress.overall.duelGamesWon = 0;
        progress.overall.raceGamesPlayed = 0;
        progress.overall.raceGamesWon = 0;
      }
      return { progress, isReturning: true };
    } catch (e) {
      console.error("Failed to load progress:", e);
      return { progress: createDefaultProgress(playerName), isReturning: false };
    }
  }

  return { progress: createDefaultProgress(playerName), isReturning: false };
}

// Save progress for a player
function saveProgress(playerName: string, progress: ProgressData): boolean {
  ensureDataDir();
  const filePath = getProgressPath(playerName);

  try {
    // Update lastActive timestamp
    progress.overall.lastActive = new Date().toISOString();
    fs.writeFileSync(filePath, JSON.stringify(progress, null, 2));
    return true;
  } catch (e) {
    console.error("Failed to save progress:", e);
    return false;
  }
}

// Parse JSON body from request
async function parseBody(req: IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

// Handle API routes
async function handleApiRoute(
  req: IncomingMessage,
  res: ServerResponse,
  pathname: string
): Promise<boolean> {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return true;
  }

  // POST /api/progress/login
  if (pathname === "/api/progress/login" && req.method === "POST") {
    try {
      const body = await parseBody(req);
      const playerName = body.playerName as string;

      if (!playerName || typeof playerName !== "string" || playerName.trim().length < 2) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid player name" }));
        return true;
      }

      const { progress, isReturning } = loadProgress(playerName.trim());
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ progress, isReturning }));
      return true;
    } catch (e) {
      console.error("Login error:", e);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal server error" }));
      return true;
    }
  }

  // POST /api/progress/save
  if (pathname === "/api/progress/save" && req.method === "POST") {
    try {
      const body = await parseBody(req);
      const playerName = body.playerName as string;
      const progress = body.progress as ProgressData;

      if (!playerName || !progress) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Missing playerName or progress" }));
        return true;
      }

      const success = saveProgress(playerName, progress);
      if (success) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true }));
      } else {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Failed to save progress" }));
      }
      return true;
    } catch (e) {
      console.error("Save error:", e);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal server error" }));
      return true;
    }
  }

  // GET /api/progress/load
  if (pathname === "/api/progress/load" && req.method === "GET") {
    try {
      const parsedUrl = parse(req.url!, true);
      const playerName = parsedUrl.query.playerName as string;

      if (!playerName) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Missing playerName parameter" }));
        return true;
      }

      const { progress, isReturning } = loadProgress(playerName);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ progress, isReturning }));
      return true;
    } catch (e) {
      console.error("Load error:", e);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal server error" }));
      return true;
    }
  }

  return false;
}

// Room storage
interface Player {
  id: string;
  name: string;
  score: number;
  ready: boolean;
}

interface PlayerAnswer {
  playerId: string;
  playerName: string;
  selectedIndex: number;
  isCorrect: boolean;
  timeMs: number;
  points: number;
}

interface Room {
  code: string;
  hostId: string;
  players: Player[];
  topicId: string | null;
  status: "waiting" | "playing" | "finished";
  currentQuestion: number;
  questionCount: number;
  questions: unknown[];
  roundAnswers: Map<string, PlayerAnswer>;
  currentCorrectIndex: number;
  gameMode: 'duel' | 'race';
  // Track players who failed this round in race mode
  raceFailedPlayers: Set<string>;
}

const rooms = new Map<string, Room>();

function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return rooms.has(code) ? generateRoomCode() : code;
}

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    const parsedUrl = parse(req.url!, true);
    const pathname = parsedUrl.pathname || "";

    // Handle custom API routes first
    if (pathname.startsWith("/api/progress/")) {
      const handled = await handleApiRoute(req, res, pathname);
      if (handled) return;
    }

    // Let Next.js handle everything else
    handle(req, res, parsedUrl);
  });

  const io = new SocketIOServer(httpServer, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Create a new room
    socket.on("create-room", ({ playerName, gameMode = 'duel' }: { playerName: string; gameMode?: 'duel' | 'race' }) => {
      const code = generateRoomCode();
      const room: Room = {
        code,
        hostId: socket.id,
        players: [{ id: socket.id, name: playerName, score: 0, ready: false }],
        topicId: null,
        status: "waiting",
        currentQuestion: 0,
        questionCount: 5,
        questions: [],
        roundAnswers: new Map(),
        currentCorrectIndex: -1,
        gameMode,
        raceFailedPlayers: new Set(),
      };
      rooms.set(code, room);
      socket.join(room.code);
      socket.emit("room-created", { room, playerId: socket.id });
      console.log(`Room ${code} created by ${playerName} (mode: ${gameMode})`);
    });

    // Join existing room
    socket.on(
      "join-room",
      ({ code, playerName }: { code: string; playerName: string }) => {
        const room = rooms.get(code.toUpperCase());
        if (!room) {
          socket.emit("error", { message: "Room not found" });
          return;
        }
        if (room.players.length >= 4) {
          socket.emit("error", { message: "Room is full" });
          return;
        }
        if (room.status !== "waiting") {
          socket.emit("error", { message: "Game already in progress" });
          return;
        }

        room.players.push({
          id: socket.id,
          name: playerName,
          score: 0,
          ready: false,
        });
        socket.join(room.code);
        socket.emit("room-joined", { room, playerId: socket.id });
        io.to(room.code).emit("player-joined", { room });
        console.log(`${playerName} joined room ${code}`);
      }
    );

    // Host selects topic
    socket.on(
      "select-topic",
      ({ code, topicId }: { code: string; topicId: string }) => {
        const room = rooms.get(code);
        if (!room || room.hostId !== socket.id) return;
        room.topicId = topicId;
        io.to(room.code).emit("topic-selected", { topicId });
      }
    );

    // Start game - host sends questions
    socket.on(
      "start-game",
      ({ code, questions }: { code: string; questions: unknown[] }) => {
        const room = rooms.get(code);
        if (!room || room.hostId !== socket.id) return;
        room.status = "playing";
        room.questions = questions;
        room.questionCount = questions.length;
        room.currentQuestion = 0;
        room.roundAnswers = new Map();
        room.raceFailedPlayers = new Set();
        // Reset all player scores for new game
        room.players.forEach((p) => (p.score = 0));
        
        // Emit different events based on game mode
        if (room.gameMode === 'race') {
          io.to(room.code).emit("race-game-started", { room, questions });
          console.log(`Race game started in room ${code} with ${questions.length} questions`);
        } else {
          io.to(room.code).emit("game-started", { room, questions });
          console.log(`Duel game started in room ${code} with ${questions.length} questions`);
        }
      }
    );

    // Submit answer (Duel mode)
    socket.on(
      "submit-answer",
      ({
        code,
        questionIndex,
        selectedIndex,
        correctIndex,
        timeMs,
        isCorrect,
        points,
      }: {
        code: string;
        questionIndex: number;
        selectedIndex: number;
        correctIndex: number;
        timeMs: number;
        isCorrect: boolean;
        points: number;
      }) => {
        const room = rooms.get(code);
        if (!room) return;

        const player = room.players.find((p) => p.id === socket.id);
        if (!player) return;

        // Store the correct index for this round
        room.currentCorrectIndex = correctIndex;

        // Store this player answer
        const answer: PlayerAnswer = {
          playerId: socket.id,
          playerName: player.name,
          selectedIndex,
          isCorrect,
          timeMs,
          points,
        };
        room.roundAnswers.set(socket.id, answer);

        // Update player score
        player.score += points;

        // Notify others that this player submitted
        io.to(room.code).emit("answer-submitted", { playerId: socket.id });

        console.log(`Player ${player.name} submitted answer in room ${code} (${room.roundAnswers.size}/${room.players.length})`);

        // Check if all players have answered
        if (room.roundAnswers.size >= room.players.length) {
          // Send round results
          const playerAnswers = Array.from(room.roundAnswers.values());
          
          io.to(room.code).emit("round-results", {
            result: {
              questionIndex,
              correctIndex: room.currentCorrectIndex,
              playerAnswers,
            },
            players: room.players.map((p) => ({
              id: p.id,
              name: p.name,
              score: p.score,
            })),
          });

          console.log(`Round ${questionIndex} complete in room ${code}`);

          // Clear for next round
          room.roundAnswers = new Map();
          room.currentQuestion = questionIndex + 1;

          // Check if game is over
          if (room.currentQuestion >= room.questionCount) {
            room.status = "finished";
            io.to(room.code).emit("game-over", {
              players: room.players.map((p) => ({
                id: p.id,
                name: p.name,
                score: p.score,
              })),
            });
            console.log(`Game over in room ${code}`);
          }
        }
      }
    );

    // Race mode answer handler
    socket.on("race-answer", ({
      code,
      questionIndex,
      selectedIndex,
      correctIndex,
      timeMs,
    }: {
      code: string;
      questionIndex: number;
      selectedIndex: number;
      correctIndex: number;
      timeMs: number;
    }) => {
      const room = rooms.get(code);
      if (!room || room.gameMode !== 'race') return;
      
      const player = room.players.find((p) => p.id === socket.id);
      if (!player) return;
      
      // Check if this player already failed this round
      if (room.raceFailedPlayers.has(socket.id)) {
        console.log(`Race: ${player.name} already failed this round, ignoring answer`);
        return;
      }
      
      const isCorrect = selectedIndex === correctIndex;
      
      if (isCorrect) {
        // First correct answer wins the round!
        const points = 100 + Math.max(0, 50 - Math.floor(timeMs / 200));
        player.score += points;
        
        // Notify all players - round is over
        io.to(room.code).emit("race-round-winner", {
          winnerId: socket.id,
          winnerName: player.name,
          questionIndex,
          correctIndex,
          selectedIndex,
          timeMs,
          points,
          players: room.players,
        });
        
        // Clear failed players for next round
        room.raceFailedPlayers.clear();
        
        console.log(`Race: ${player.name} won round ${questionIndex + 1} in room ${code}`);
      } else {
        // Wrong answer - mark player as failed for this round
        room.raceFailedPlayers.add(socket.id);
        
        // Broadcast to ALL players that this player got it wrong
        io.to(room.code).emit("race-wrong-answer", {
          playerId: socket.id,
          playerName: player.name,
          questionIndex,
          selectedIndex,
        });
        
        console.log(`Race: ${player.name} answered wrong in room ${code} (${room.raceFailedPlayers.size}/${room.players.length} failed)`);
        
        // Check if ALL players have failed - no winner this round
        if (room.raceFailedPlayers.size >= room.players.length) {
          io.to(room.code).emit("race-round-no-winner", {
            questionIndex,
            correctIndex,
          });
          room.raceFailedPlayers.clear();
          console.log(`Race: No winner for round ${questionIndex + 1} in room ${code} - all players failed`);
        }
      }
    });

    // Race mode - host advances to next question
    socket.on("race-next-question", ({ code }: { code: string }) => {
      const room = rooms.get(code);
      if (!room || room.hostId !== socket.id) return;
      
      room.currentQuestion++;
      room.roundAnswers.clear();
      room.raceFailedPlayers.clear();
      
      if (room.currentQuestion >= room.questionCount) {
        room.status = "finished";
        io.to(room.code).emit("race-game-over", {
          players: room.players,
        });
        console.log(`Race game over in room ${code}`);
      } else {
        io.to(room.code).emit("race-question-start", {
          questionIndex: room.currentQuestion,
        });
        console.log(`Race: Starting question ${room.currentQuestion + 1} in room ${code}`);
      }
    });

    // Rematch request
    socket.on("request-rematch", ({ code }: { code: string }) => {
      const room = rooms.get(code);
      if (!room) return;
      room.status = "waiting";
      room.currentQuestion = 0;
      room.questions = [];
      room.roundAnswers = new Map();
      room.raceFailedPlayers = new Set();
        // Reset all player scores for new game
        room.players.forEach((p) => (p.score = 0));
      room.players.forEach((p) => (p.score = 0));
      io.to(room.code).emit("rematch-started", { room });
      console.log(`Rematch started in room ${code}`);
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
      rooms.forEach((room, roomCode) => {
        const playerIndex = room.players.findIndex((p) => p.id === socket.id);
        if (playerIndex !== -1) {
          const player = room.players[playerIndex];
          room.players.splice(playerIndex, 1);
          io.to(room.code).emit("player-left", { playerName: player.name, room });
          io.to(room.code).emit("player-disconnected", { playerId: socket.id });

          if (room.players.length === 0) {
            rooms.delete(roomCode);
            console.log(`Room ${roomCode} deleted (empty)`);
          } else if (room.hostId === socket.id) {
            room.hostId = room.players[0].id;
            io.to(room.code).emit("host-changed", { newHostId: room.hostId });
          }
        }
      });
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
