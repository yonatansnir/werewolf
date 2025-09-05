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
    swapTaskQueue: [],
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

  const connection: Connection = {
    playerId,
    response: res,
  };

  connections.set(connection.playerId, connection);

  req.on("close", () => {
    connections.delete(connection.playerId);
    game.players = game.players.filter((p) => p.id !== playerId);
    game.players.forEach((p) => {
      const conn = connections.get(p.id);
      if (!conn) return;
      conn.response.write(`data: ${JSON.stringify(game)}\n\n`);
    });
    console.log(`Player ${playerId} disconnected`);
    if (game.players.length === 0) {
      games.delete(game.id);
      console.log(`Game ${game.id} deleted`);
    }
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

const rolesAllowedToSwap: Role[] = ["robber", "troublemaker"];

app.post("/api/swap-players", (req, res) => {
  console.log("Swap players", req.body);
  const { playerId, firstPlayerId, secondPlayerId, gameId } = req.body;
  if (!playerId || !firstPlayerId || !secondPlayerId || !gameId)
    throw new Error(
      "Player ID, First Player ID, Second Player ID, and Game ID are required"
    );

  const game = games.get(gameId);
  if (!game) throw new Error("Game not found");

  const player = game.players.find((p) => p.id === playerId);
  const first = game.players.find((p) => p.id === firstPlayerId);
  const second = game.players.find((p) => p.id === secondPlayerId);
  if (!player || !first || !second) throw new Error("Player not found");
  if (!rolesAllowedToSwap.includes(player.role))
    throw new Error("Only robber or troublemaker can swap players");

  game.swapTaskQueue.push({ playerId, firstPlayerId, secondPlayerId });

  // game.players.forEach((p) => {
  //   const connection = connections.get(p.id);
  //   if (connection) {
  //     connection.response.write(`data: ${JSON.stringify(game)}\n\n`);
  //   }
  // });

  res.json(game);
});

app.post("/api/ready", (req, res) => {
  console.log("Ready To play", req.body);
  const { playerId, gameId } = req.body;
  if (!playerId || !gameId) throw new Error("player id or game id is missing");
  const game = games.get(gameId);
  if (!game) throw new Error("Game not found");
  const player = game.players.find((p) => p.id === playerId);
  if (!player) throw new Error("Player not found");

  player.isReady = true;
  const isEveryPlayersAreReady = game.players.every((p) => p.isReady);
  if (isEveryPlayersAreReady) {
    game.gameState = "playing";
    game.swapTaskQueue.forEach(({ firstPlayerId, secondPlayerId }) => {
      const firstPlayer = game.players.find((p) => p.id === firstPlayerId);
      const secondPlayer = game.players.find((p) => p.id === secondPlayerId);

      if (firstPlayer && secondPlayer) {
        const tempRole = firstPlayer.role;
        firstPlayer.role = secondPlayer.role;
        secondPlayer.role = tempRole;
        console.log(
          `Swapped roles between ${player.playerName} and ${firstPlayer.playerName}`
        );
      }
    });
  }
  game.players.forEach((p) => {
    const connection = connections.get(p.id);
    if (!connection) return;
    connection.response.write(`data: ${JSON.stringify(game)}\n\n`);
  });
  res.json({ status: "OK" });
});

app.post("/api/restart-game", (req, res) => {
  console.log("Restart game", req.body);
  const { gameId, playerId } = req.body;
  if (typeof gameId !== "string") throw new Error("Game ID is required");
  if (typeof playerId !== "string") throw new Error("Player ID is required");
  const game = games.get(gameId);
  if (!game) throw new Error("Game not found");
  const isPlayerHost = game.players.find((p) => p.id === playerId)?.isHost;
  if (!isPlayerHost) throw new Error("Only the host can restart the game");

  game.gameState = "roles";
  game.players.forEach((p) => (p.isReady = false));
  game.swapTaskQueue = [];
  const availableRoles = getAvailableRoles();
  game.availableRoles = availableRoles;
  game.players.forEach((p) => {
    const index = Math.floor(Math.random() * availableRoles.length);
    p.role = availableRoles.splice(index, 1)[0];
  });

  game.players.forEach((p) => {
    const connection = connections.get(p.id);
    if (connection) {
      connection.response.write(`data: ${JSON.stringify(game)}\n\n`);
    }
  });
  res.json({ status: "OK" });
});

app.listen(8080, () => {
  console.log("Server running on http://localhost:8080");
});
