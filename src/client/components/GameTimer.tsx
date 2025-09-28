import { createSignal, onCleanup, Show, For } from "solid-js";
import { game, playerId } from "../signals";
import { roleDefinitions } from "../../shared/role-definitions";
import { restartGame } from "../services";

const THREE_MINUTES_IN_SECOUND = 60 * 3;

// Color logic: green > yellow > red
const getColor = (percent: number) => {
  let barColor = "bg-green-400";
  if (percent <= 0.15) {
    barColor = "bg-red-500";
  } else if (percent <= 0.5) {
    barColor = "bg-yellow-400";
  }

  return barColor;
};

export function GameTimer() {
  const [progress, setProgress] = createSignal({
    timeLeft: THREE_MINUTES_IN_SECOUND,
    percent: THREE_MINUTES_IN_SECOUND / THREE_MINUTES_IN_SECOUND,
    color: "bg-green-400",
  });
  const currentPlayer = game()?.players.find((p) => p.id === playerId())!;
  const roleDefinition = roleDefinitions[currentPlayer.role];
  const timer = setInterval(() => {
    setProgress((prev) => {
      const timeLeft = prev.timeLeft - 1;
      const percent = timeLeft / THREE_MINUTES_IN_SECOUND;
      const color = getColor(percent);
      if (timeLeft === 0) clearTimeout(timer);
      return {
        timeLeft,
        color,
        percent,
      };
    });
  }, 1000);

  onCleanup(() => clearInterval(timer));

  const handleRestartGame = async () => {
    await restartGame(game()!.id, playerId()!);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div class="flex flex-col items-center justify-center p-6 bg-white/10 rounded-xl shadow-lg border border-white/20 max-w-xs mx-auto">
      <h2 class="text-2xl font-bold text-white mb-2">Game in Progress</h2>
      <div class="text-lg text-white mb-1">Time left:</div>
      <div class="text-4xl font-mono font-bold text-white mb-2 drop-shadow">
        {formatTime(progress().timeLeft)}
      </div>
      <div class="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          class={`h-2 ${progress().color} transition-all duration-1000`}
          style={{ width: `${progress().percent * 100}%` }}
        ></div>
      </div>
      <Show when={progress().timeLeft <= 0}>
        <div class="grid-cols-2 gap-1">
          <For each={game()!.players}>
            {(p) => {
              return (
                <div
                  class={`m-3 p-3 ${
                    p.id === playerId() ? "bg-blue-800" : "bg-white/10"
                  } hover:bg-blue-600/30 text-white border-amber-500 rounded-lg transition-colors text-center`}
                >
                  <span class="text-ml font-mono text-white">
                    {roleDefinitions[p.role].icon}{" "}
                    {roleDefinitions[p.role].name}
                  </span>
                  <div class="text-sm font-medium">
                    {p.playerName}{" "}
                    {playerId() === p.id && (
                      <span class="text-purple-300 text-sm">(You)</span>
                    )}
                  </div>
                </div>
              );
            }}
          </For>
        </div>
      </Show>
      <Show when={game()?.players.find((p) => p.id === playerId())?.isHost}>
        <button
          onClick={handleRestartGame}
          class="my-4 p-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-lg transition-colors cursor-pointer"
        >
          Restart Game
        </button>
      </Show>
    </div>
  );
}
