import { createSignal, For } from "solid-js";
import { Wifi, WifiOff } from "../icons";
import { CreateGame } from "./CreateGame";
import { JoinGame } from "./JoinGame";

export function Menu() {
	const [view, setView] = createSignal<"create" | "join">("join");

	return (
		<div class="max-w-md mx-auto">
			<div class="text-center mb-8">
				<h1 class="text-4xl font-bold text-white mb-2">🐺 Werewolf</h1>
				<p class="text-purple-200">Online Multiplayer Game</p>
				<div class="flex items-center justify-center gap-2 mt-2">
					{true ? (
						<>
							<Wifi class="w-4 h-4 text-green-400" />
							<span class="text-green-400 text-sm">Online</span>
						</>
					) : (
						<>
							<WifiOff class="w-4 h-4 text-red-400" />
							<span class="text-red-400 text-sm">Offline</span>
						</>
					)}
				</div>
			</div>

			<div class="flex justify-center mb-4">
				<For each={["join", "create"] as const}>
					{(label) => (
						<button
							class={`cursor-pointer capitalize px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
								view() === label
									? "text-yellow-300 border-yellow-300"
									: "text-gray-500 border-transparent hover:text-yellow-600 hover:border-yellow-600"
							}`}
							onClick={() => setView(label)}
						>
							{label}
						</button>
					)}
				</For>
			</div>

			{view() === "create" && <CreateGame />}
			{view() === "join" && <JoinGame />}

			<div class="bg-white/10 backdrop-blur-lg rounded-3xl p-6">
				<h3 class="text-lg font-semibold text-white mb-3">
					How to Play
				</h3>
				<div class="text-white/80 text-sm space-y-1">
					<p>• Each player gets a secret role</p>
					<p>• Werewolves eliminate villagers at night</p>
					<p>• Villagers vote out werewolves during day</p>
					<p>• Village wins by eliminating all werewolves</p>
					<p>• Werewolves win by equaling villagers</p>
				</div>
			</div>
		</div>
	);
}
