import type { Accessor } from "solid-js";
import { roleDefinitions } from "../../shared/role-definitions";
import { AVAILABLE_CARDS } from "../utils";

interface RoleManagerProps {
  cards: Accessor<Set<number>>;
  toggleCards: (cardId: (typeof AVAILABLE_CARDS)[number]["id"]) => void;
}

export function RoleManager({ cards, toggleCards }: RoleManagerProps) {
  return (
    <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-6 mb-6">
      <h3 class="text-lg font-semibold text-white mb-3">Select Roles</h3>
      <div class="grid grid-cols-2 gap-4">
        {AVAILABLE_CARDS.map((item) => (
          <button
            onClick={() => toggleCards(item.id)}
            class={`p-4 rounded-xl border text-white transition-colors ${
              cards().has(item.id)
                ? `bg-blue-900`
                : "bg-white/20 border-white/30"
            }`}
          >
            <span class="text-2xl">{roleDefinitions[item.role].icon}</span>
            <p class="mt-2 text-sm font-medium">
              {roleDefinitions[item.role].name}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
