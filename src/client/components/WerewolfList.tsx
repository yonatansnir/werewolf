import { For, createSignal } from "solid-js";
import { game, playerId } from "../signals";
import { roleDefinitions } from "../../shared/role-definitions";

export function WerewolfList() {
  const otherWerewolf = () => {
    const werewolves = game()!.players.filter(
      (p) => p.role === "werewolf" && p.id !== playerId()
    );

    return werewolves.length > 0 ? werewolves : null;
  };

  return (
    <div>
      <p class="text-white">Other Werewolves:</p>
      <For
        each={otherWerewolf()}
        fallback={<p class="text-white">No other werewolves found.</p>}
      >
        {(werewolf) => (
          <p class="text-white my-1">
            {roleDefinitions.werewolf.icon} {werewolf.playerName}
          </p>
        )}
      </For>
    </div>
  );
}
