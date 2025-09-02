import { createSignal, For, type Setter } from "solid-js";
import { roleDefinitions } from "../../shared/role-definitions";
import { game, player } from "../signals";
import { Eye } from "../icons";

interface TroublemakerProps {
  setSwapPlayers: Setter<{
    player1: string;
    player2: string;
  }>;
}

export function Troublemaker({ setSwapPlayers }: TroublemakerProps) {
  const [targetPlayersId, setTargetPlayersId] = createSignal<Set<string>>(
    new Set()
  );

  const handleTargeting = async (playerId: string) => {
    const currentTarget = targetPlayersId();
    if (currentTarget.size === 2) return;
    currentTarget.add(playerId);
    const [player1, player2] = Array.from(currentTarget);
    setTargetPlayersId(new Set(currentTarget));
    setSwapPlayers({ player1: player1 || "", player2: player2 || "" });
  };

  return (
    <>
      <div>
        <p class="text-white/90 leading-relaxed">
          {roleDefinitions.troublemaker.nightAction}
        </p>
        <div class="grid grid-cols-2 gap-2">
          <For each={game()?.players.filter((p) => p.id !== player()!.id)}>
            {(p) => {
              return (
                <button
                  onClick={() => handleTargeting(p.id)}
                  class="p-3 bg-white/10 hover:bg-blue-600/30 text-white rounded-lg transition-colors text-center"
                >
                  <div
                    class={`w-8 h-8 ${
                      targetPlayersId().has(p.id)
                        ? "bg-green-500"
                        : "bg-blue-500"
                    } rounded-full flex items-center justify-center mx-auto mb-1`}
                  >
                    <Eye class="w-4 h-4 text-white" />
                  </div>

                  <div class="text-xs font-medium">{p.playerName}</div>
                </button>
              );
            }}
          </For>
        </div>
      </div>
    </>
  );
}
