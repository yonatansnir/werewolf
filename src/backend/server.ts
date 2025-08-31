import express from "express";
import { getAvailableRoles } from "./roles";
import { generatePlayer } from "./players.utils";

const app = express();
app.use(express.json());

type Connection = { playerId: string; response: express.Response };

const games = new Map<string, Game>();
const connections = new Map<string, Connection>();

app.post("/api/create-game", (req, res) => {
  const playerName = req.body.playerName;
  if (!playerName) throw new Error("Player name is required");

  const gameId = Math.random().toString(36).substring(2, 8).toUpperCase();
  const availableRoles = getAvailableRoles();
  const player = generatePlayer(playerName, true);
  console.log("Create player", player);
  const index = Math.floor(Math.random() * availableRoles.length);
  player.role = availableRoles.splice(index, 1)[0];

  const game: Game = {
    id: gameId,
    gameState: "lobby",
    players: [player],
    availableRoles,
  };
  console.log("Create Game", game);
  games.set(gameId, game);

  res.json({ game, player });
});

app.post("/api/join-game", (req, res) => {
  console.log("Join game", req.body);
  const playerName = req.body.playerName;
  if (!playerName) throw new Error("Player name is required");

  const gameId = req.body.gameId;
  if (!gameId) throw new Error("Game ID is required");

  console.log("recived player join request", { playerName, gameId });
  const game = games.get(gameId);
  if (!game) throw new Error("Game not found");

  console.log("Game", game);

  const availableRoles = game.availableRoles;
  if (availableRoles.length === 0) throw new Error("No available roles");

  const player = generatePlayer(playerName, false);
  const index = Math.floor(Math.random() * availableRoles.length);
  player.role = availableRoles.splice(index, 1)[0];

  game.players.push(player);

  game.players.forEach((p) => {
    const connection = connections.get(p.id);
    if (connection) {
      connection.response.write(`data: ${JSON.stringify(game)}\n\n`);
    }
  });
  res.json({ player, game });
});

app.get("/api/game", (req, res) => {
  const gameId = req.query.game;
  const playerId = req.query.player;
  if (typeof gameId !== "string") throw new Error("Game ID is required");
  const game = games.get(gameId);
  if (!game) throw new Error("Game not found");
  if (typeof playerId !== "string") throw new Error("Player ID is required");
  const player = game.players.find((p) => p.id === playerId);
  if (!player) throw new Error("Player not found");
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  // res.flushHeaders();

  const connection: Connection = {
    playerId,
    response: res,
  };

  connections.set(connection.playerId, connection);

  connection.response.on("close", () => {
    connections.delete(connection.playerId);
    console.log(`Player ${playerId} disconnected`);
  });

  connection.response.write(`id: ${Date.now()}\n`);
  connection.response.write(`event: message\n`);
  connection.response.write(`data: ${JSON.stringify(game)}\n\n`);
});

app.post("/api/start-game", (req, res) => {
  console.log("Start game", req.body);
  const { gameId, playerId } = req.body;
  if (typeof gameId !== "string") throw new Error("Game ID is required");
  if (typeof playerId !== "string") throw new Error("Player ID is required");

  const game = games.get(gameId);
  if (!game) throw new Error("Game not found");
  // if (game.players.length < 2) throw new Error("Not enough players");
  const isPlayerHost = game.players.find((p) => p.id === playerId)?.isHost;
  if (!isPlayerHost) throw new Error("Only the host can start the game");

  game.gameState = "roles";
  console.log("Send update to players");
  game.players.forEach((p) => {
    const connection = connections.get(p.id);
    if (connection) {
      connection.response.write(`data: ${JSON.stringify(game)}\n\n`);
    }
  });
  res.json(game);
});

app.post("/api/swap-players", (req, res) => {
  console.log("Swap players", req.body);
  const { playerId, targetPlayerId, gameId } = req.body;
  if (!playerId || !targetPlayerId || !gameId)
    throw new Error("Player ID, Target Player ID, and Game ID are required");

  const game = games.get(gameId);
  if (!game) throw new Error("Game not found");

  const player = game.players.find((p) => p.id === playerId);
  const targetPlayer = game.players.find((p) => p.id === targetPlayerId);
  if (!player || !targetPlayer) throw new Error("Player not found");
  if (player.role !== "robber")
    throw new Error("Only the robber can swap players");

  // Swap roles
  const playerRole = player.role;
  const playerTeam = player.team;

  player.role = targetPlayer.role;
  targetPlayer.role = playerRole;

  player.team = targetPlayer.team;
  targetPlayer.team = playerTeam;

  game.players.forEach((p) => {
    const connection = connections.get(p.id);
    if (connection) {
      connection.response.write(`data: ${JSON.stringify(game)}\n\n`);
    }
  });

  res.json(game);
});

app.listen(8080, () => {
  console.log("Server running on http://localhost:8080");
});
