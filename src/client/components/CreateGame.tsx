import { createSignal } from "solid-js";
import { createNewGame } from "../services";
import { setGame, setPlayerId } from "../signals";
import { RoleManager } from "./RoleManager";
import { getGameCards } from "../utils";

export function CreateGame() {
  const [playerName, setPlayerName] = createSignal<string>("");
  const [cards, setCards] = createSignal<Set<number>>(new Set());

  const toggleCards = (cardId: number) => {
    setCards((prev) => {
      const newCardsSet = new Set(prev);
      if (newCardsSet.has(cardId)) {
        newCardsSet.delete(cardId);
      } else {
        newCardsSet.add(cardId);
      }
      return newCardsSet;
    });
  };

  const handleCreateGame = async () => {
    const currentPlayerName = playerName();
    const currentCards = cards();
    if (!currentPlayerName || currentCards.size < 4) return;
    const roles = getGameCards(currentCards);
    const { game, player } = await createNewGame(currentPlayerName, roles);
    setPlayerId(player.id);
    setGame(game);
  };

  return (
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
      <RoleManager toggleCards={toggleCards} cards={cards} />
      <button
        class="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold text-lg transition-colors"
        onClick={handleCreateGame}
      >
        Create New Game
      </button>
    </div>
  );
}
