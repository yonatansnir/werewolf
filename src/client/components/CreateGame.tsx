import { createSignal } from "solid-js";
import { createNewGame } from "../services";
import { setGame, setPlayerId } from "../signals";
import { RoleManager } from "./RoleManager";

export function CreateGame() {
	const [playerName, setPlayerName] = createSignal<string>("");

	const handleCreateGame = async () => {
		const currentPlayerName = playerName();
		if (!currentPlayerName) return;
		const { game, player } = await createNewGame(currentPlayerName);
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
			<RoleManager />
			<button
				class="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold text-lg transition-colors"
				onClick={handleCreateGame}
			>
				Create New Game
			</button>
		</div>
	);
}
