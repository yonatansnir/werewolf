import { createSignal } from "solid-js";
import { joinGame } from "../services";
import { setGame, setPlayerId } from "../signals";

export function JoinGame() {
	const [roomCode, setRoomCode] = createSignal<string>("");
	const [playerName, setPlayerName] = createSignal<string>("");

	const handleJoinGame = async () => {
		const currentPlayerName = playerName();
		const currentRoomCode = roomCode();
		if (!currentPlayerName || !currentRoomCode) return;
		const { game, player } = await joinGame(
			currentPlayerName,
			currentRoomCode
		);
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

			<div class="mb-6">
				<label class="block text-white text-sm font-medium mb-2">
					Room Code
				</label>
				<input
					type="text"
					value={roomCode()}
					onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
					placeholder="Enter room code"
					class="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-green-400"
				/>
			</div>

			<button
				onClick={handleJoinGame}
				class="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-lg transition-colors"
			>
				Join Game
			</button>
		</div>
	);
}
