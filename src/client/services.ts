import axios from "axios";

export async function createNewGame(playerName: string, cards: Role[]) {
  const response = await axios.post<{ game: Game; player: Player }>(
    "/api/create-game",
    { playerName, cards }
  );

  return response.data;
}

export async function joinGame(playerName: string, gameId: string) {
  const response = await axios.post<{ game: Game; player: Player }>(
    "/api/join-game",
    { playerName, gameId }
  );

  return response.data;
}

export async function startGame(gameId: string, playerId: string) {
  const response = await axios.post<Game>("/api/start-game", {
    gameId,
    playerId,
  });

  return response.data;
}

export async function swapPlayers(
  playerId: string,
  firstPlayerId: string,
  secondPlayerId: string,
  gameId: string
) {
  const response = await axios.post<Game>("/api/swap-players", {
    playerId,
    firstPlayerId,
    secondPlayerId,
    gameId,
  });

  return response.data;
}

export async function updatePlayerToBeReady(gameId: string, playerId: string) {
  const response = await axios.post<{ status: "OK" }>("/api/ready", {
    gameId,
    playerId,
  });

  return response.data;
}

export async function restartGame(gameId: string, playerId: string) {
  const response = await axios.post<{ status: "OK" }>("/api/restart-game", {
    gameId,
    playerId,
  });

  return response.data;
}
