import { createSignal, For, Show } from "solid-js";
import { roleDefinitions } from "../../shared/role-definitions";
import { game, player } from "../signals";
import { Eye } from "../icons";
import { swapPlayers } from "../services";

export function Troublemaker() {
  const [targetPlayersId, setTargetPlayersId] = createSignal<Set<string>>(
    new Set()
  );

  const handleTargeting = async (playerId: string) => {
    const currentTarget = targetPlayersId();
    if (currentTarget.has(playerId)) {
      currentTarget.delete(playerId);
    } else {
      if (currentTarget.size >= 2) return;
      currentTarget.add(playerId);
    }
    setTargetPlayersId(new Set(currentTarget));
  };
  // await swapPlayers(player()!.id, playerId, game()!.id);

  return (
    <div>
      <p class="text-white/90 leading-relaxed">
        {roleDefinitions.troublemaker.nightAction}
      </p>
      <div class="grid grid-cols-2 gap-2">
        <For each={game()?.players}>
          {(p) => {
            return (
              <button
                onClick={() => handleTargeting(p.id)}
                class="p-3 bg-white/10 hover:bg-blue-600/30 text-white rounded-lg transition-colors text-center"
              >
                <div
                  class={`w-8 h-8 ${
                    targetPlayersId().has(p.id) ? "bg-green-500" : "bg-blue-500"
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
  );
}
