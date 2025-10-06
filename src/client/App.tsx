import { Match, Switch, createEffect, createMemo, onCleanup } from "solid-js";
import { GameTimer } from "./components/GameTimer";
import { Menu } from "./components/Menu";
import { Lobby } from "./components/Lobby";
import { game, playerId, setGame } from "./signals";
import { Role } from "./components/Role";

export function App() {
  let es: EventSource | null = null;
  const gameId = createMemo(() => game()?.id);

  createEffect(() => {
    const currentGameId = gameId();
    const currentPlayerId = playerId();
    if (!currentGameId || !currentPlayerId) return;

    es = new EventSource(
      `/api/game?game=${currentGameId}&player=${currentPlayerId}`
    );

    es.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      setGame(parsed);
    };

    es.onerror = (err) => {
      console.error("SSE error:", err);
    };
  });

  onCleanup(() => {
    if (es) es.close();
  });

  return (
    <div class="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4">
      <Switch fallback={<Menu />}>
        <Match when={game()?.gameState === "lobby"} children={<Lobby />} />
        <Match when={game()?.gameState === "roles"} children={<Role />} />
        <Match
          when={
            game()?.gameState === "playing" || game()?.gameState === "game_over"
          }
          children={<GameTimer />}
        />
      </Switch>
    </div>
  );
}
