import { For, Show } from "solid-js";
import { Clock, Copy, Crown } from "../icons";
import { game, playerId } from "../signals";
import { startGame } from "../services";

export function Lobby() {
  const copyRoomCode = () => {
    const currentGame = game()?.id;
    if (!currentGame) return;
    navigator.clipboard.writeText(currentGame);
    alert("Room code copied to clipboard!");
  };

  const handleStartGame = async () => {
    const currentGameId = game()?.id;
    const currentPlayerId = playerId();
    if (!currentGameId || !currentPlayerId) return;
    await startGame(currentGameId, currentPlayerId);
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4">
      <div class="max-w-md mx-auto">
        <div class="text-center mb-6">
          <h1 class="text-3xl font-bold text-white mb-2">Game Lobby</h1>
          <div class="flex items-center justify-center gap-2">
            <span class="text-2xl font-mono text-purple-200">{game()?.id}</span>
            <button onClick={copyRoomCode} class="p-1">
              <Copy class="w-5 h-5 text-purple-300 hover:text-white" />
            </button>
          </div>
          <p class="text-purple-300 text-sm mt-1">
            Share this code with friends
          </p>
        </div>

        <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-6 mb-6">
          <h2 class="text-xl font-semibold text-white mb-4">
            Players ({game()?.players.length})
          </h2>

          <div class="space-y-3">
            <For each={game()?.players}>
              {(player) => (
                <div class="flex items-center gap-3 bg-white/10 rounded-lg p-3">
                  <div
                    class={`w-3 h-3 rounded-full ${
                      player.connected ? "bg-green-400" : "bg-red-400"
                    }`}
                  ></div>
                  <span class="text-white font-medium flex-1">
                    {player.playerName}
                  </span>
                  {player.isHost && <Crown class="w-4 h-4 text-yellow-400" />}
                  {player.id === playerId() && (
                    <span class="text-purple-300 text-sm">(You)</span>
                  )}
                </div>
              )}
            </For>
          </div>
          <Show when={game()!.players.length < 4}>
            <div class="mt-4 p-3 bg-yellow-600/20 border border-yellow-400/30 rounded-lg">
              <p class="text-yellow-200 text-sm">
                Waiting for more players... (Need at least 4)
              </p>
            </div>
          </Show>
        </div>
        <Show
          when={game()?.players.find((p) => p.id === playerId())?.isHost}
          fallback={
            <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-6">
              <div class="flex items-center justify-center gap-2 text-white/60">
                <Clock class="w-5 h-5" />
                <span>Waiting for host to start the game...</span>
              </div>
            </div>
          }
        >
          <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-6">
            <button
              disabled={game()!.players?.length < 4}
              onClick={handleStartGame}
              class={`w-full py-4 rounded-xl font-semibold text-white transition-colors ${
                game()!.players.length >= 4
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-500 cursor-not-allowed"
              }`}
            >
              Start Game
            </button>
          </div>
        </Show>
      </div>
    </div>
  );
}
