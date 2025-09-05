import { createSignal } from "solid-js";
import { createNewGame, joinGame } from "../services";
import { setGame, setPlayerId } from "../signals";
import { Wifi, WifiOff } from "../icons";

export function Menu() {
  const [roomCode, setRoomCode] = createSignal<string>("");
  const [playerName, setPlayerName] = createSignal<string>("");

  const handleCreateGame = async () => {
    const currentPlayerName = playerName();
    if (!currentPlayerName) return;
    const { game, player } = await createNewGame(currentPlayerName);
    setPlayerId(player.id);
    setGame(game);
  };

  const handleJoinGame = async () => {
    const currentPlayerName = playerName();
    const currentRoomCode = roomCode();
    if (!currentPlayerName || !currentRoomCode) return;
    const { game, player } = await joinGame(currentPlayerName, currentRoomCode);
    setPlayerId(player.id);
    setGame(game);
  };

  return (
    <div class="max-w-md mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-white mb-2">🐺 Werewolf</h1>
        <p class="text-purple-200">Online Multiplayer Game</p>
        <div class="flex items-center justify-center gap-2 mt-2">
          {true ? (
            <>
              <Wifi class="w-4 h-4 text-green-400" />
              <span class="text-green-400 text-sm">Online</span>
            </>
          ) : (
            <>
              <WifiOff class="w-4 h-4 text-red-400" />
              <span class="text-red-400 text-sm">Offline</span>
            </>
          )}
        </div>
      </div>

      <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-6 mb-6">
        <div class="mb-6">
          <label class="block text-white text-sm font-medium mb-2">
            Your Name
          </label>
          <input
            type="text"
            value={playerName()}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            class="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div class="space-y-3">
          <button
            class="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold text-lg transition-colors"
            onClick={handleCreateGame}
          >
            Create New Game
          </button>

          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-white/20"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-transparent text-white/60">or</span>
            </div>
          </div>

          <input
            type="text"
            value={roomCode()}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            placeholder="Enter room code"
            class="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <button
            onClick={handleJoinGame}
            class="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-lg transition-colors"
          >
            Join Game
          </button>
        </div>
      </div>

      <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-6">
        <h3 class="text-lg font-semibold text-white mb-3">How to Play</h3>
        <div class="text-white/80 text-sm space-y-1">
          <p>• Each player gets a secret role</p>
          <p>• Werewolves eliminate villagers at night</p>
          <p>• Villagers vote out werewolves during day</p>
          <p>• Village wins by eliminating all werewolves</p>
          <p>• Werewolves win by equaling villagers</p>
        </div>
      </div>
    </div>
  );
}
