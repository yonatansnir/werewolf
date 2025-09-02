import { createSignal, For, Show, type Setter } from "solid-js";
import { roleDefinitions } from "../../shared/role-definitions";
import { game, player } from "../signals";
import { Eye } from "../icons";

interface RobberProps {
  setSwapPlayers: Setter<{
    player1: string;
    player2: string;
  }>;
}

export function Robber({ setSwapPlayers }: RobberProps) {
  const [targetPlayerId, setTargetPlayerId] = createSignal<string | null>(null);

  const handleTargeting = (playerId: string) => {
    const currentTarget = targetPlayerId();
    if (currentTarget) return;
    setTargetPlayerId(playerId);
    setSwapPlayers({ player1: player()!.id, player2: playerId });
  };

  return (
    <div>
      <p class="text-white/90 leading-relaxed">
        {roleDefinitions.robber.nightAction}
      </p>
      <div class="grid grid-cols-2 gap-2">
        <For each={game()?.players}>
          {(p) => {
            return (
              <button
                onClick={() => handleTargeting(p.id)}
                class="p-3 bg-white/10 hover:bg-blue-600/30 text-white rounded-lg transition-colors text-center"
              >
                <Show
                  when={p.id === targetPlayerId()}
                  fallback={
                    <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-1">
                      <Eye class="w-4 h-4 text-white" />
                    </div>
                  }
                >
                  <span class="text-sm font-mono text-white">{p.role}</span>
                </Show>

                <div class="text-xs font-medium">{p.playerName}</div>
              </button>
            );
          }}
        </For>
      </div>
    </div>
  );
}
