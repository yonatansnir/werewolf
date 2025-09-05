import { createSignal, For, Show } from "solid-js";
import { game, playerId } from "../signals";
import { Eye } from "../icons";
import { roleDefinitions } from "../../shared/role-definitions";

export function Seer() {
  const [investigatingPlayerId, setInvestigatingPlayerId] =
    createSignal<string>("");

  const handleInvestigating = (playerId: string) => {
    if (investigatingPlayerId()) return;
    setInvestigatingPlayerId(playerId);
  };

  return (
    <>
      <div class="bg-blue-600/20 backdrop-blur-lg rounded-2xl p-4 mt-6">
        <h3 class="text-white font-semibold mb-3">👁️ Investigate Someone</h3>
        <div class="grid grid-cols-2 gap-2">
          <For each={game()!.players}>
            {(p) => {
              if (p.id === playerId()) return null;
              return (
                <button
                  onClick={() => handleInvestigating(p.id)}
                  class="p-3 bg-white/10 hover:bg-blue-600/30 text-white rounded-lg transition-colors text-center"
                >
                  <Show
                    when={p.id === investigatingPlayerId()}
                    fallback={
                      <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-1">
                        <Eye class="w-4 h-4 text-white" />
                      </div>
                    }
                  >
                    <span class="text-sm font-mono text-white">
                      {roleDefinitions[p.role].icon} {p.role}
                    </span>
                  </Show>

                  <div class="mt-2 text-xs font-medium">{p.playerName}</div>
                </button>
              );
            }}
          </For>
        </div>
      </div>
    </>
  );
}
