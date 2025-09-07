type GameState = "menu" | "lobby" | "roles" | "playing" | "game_over";

type Role = "werewolf" | "villager" | "seer" | "troublemaker" | "robber";

type Team = "werewolf" | "village";

interface Player {
  id: string;
  playerName: string;
  connected: boolean;
  role: Role;
  team: Team;
  isReady: boolean;
  isHost: boolean;
}

interface Game {
  id: string;
  gameState: GameState;
  swapTaskQueue: {
    playerId: string;
    firstPlayerId: string;
    secondPlayerId: string;
  }[];
  players: Player[];
  availableCards: Role[];
  cards: Role[];
}

interface RoleDefinition {
  name: string;
  description: string;
  team: Team;
  nightAction?: string;
  winCondition: string;
  priority: number; // Order of night actions (lower = earlier)
  color: string; // Primary color for the role
  backgroundColor: string; // Background color for cards/UI
  icon: string; // Icon name or emoji
}
