import { Match, Switch, createEffect, createMemo, onCleanup } from "solid-js";
import { Menu } from "./components/Menu";
import { Lobby } from "./components/Lobby";
import { game, player, setGame } from "./signals";
import { Role } from "./components/Role";

export function WerewolfGame() {
  let es: EventSource | null = null;
  const gameId = createMemo(() => game()?.id);

  createEffect(() => {
    const currentGameId = gameId();
    const currentPlayerId = player()?.id;
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
        {/* <Match when={gameState() === "menu"} children={} /> */}
        <Match when={game()?.gameState === "lobby"} children={<Lobby />} />
        <Match when={game()?.gameState === "roles"} children={<Role />} />
      </Switch>
    </div>
  );

  // if (gameState() === 'playing') {
  //   return (
  //     <div class="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-gray-900 p-4">
  //       <div class="max-w-md mx-auto">
  //         <div class="text-center mb-6">
  //           <div class="flex items-center justify-center gap-3 mb-2">
  //             {gamePhase === 'night' ? (
  //               <Moon class="w-6 h-6 text-blue-300" />
  //             ) : (
  //               <Sun class="w-6 h-6 text-yellow-300" />
  //             )}
  //             <h1 class="text-3xl font-bold text-white">
  //               {gamePhase === 'night' ? 'Night' : 'Day'} {dayCount}
  //             </h1>
  //           </div>

  //           {myRoleData && (
  //             <div class="flex items-center justify-center gap-2 text-sm">
  //               <MyRoleIcon class="w-4 h-4 text-white/60" />
  //               <span class="text-white/60">You are the {myRoleData.name}</span>
  //             </div>
  //           )}
  //         </div>

  //         {/* Role-specific actions */}
  //         {/* {gamePhase() === 'night' && myRole === 'werewolf' && (
  //           <div class="bg-red-600/20 backdrop-blur-lg rounded-2xl p-4 mb-6">
  //             <h3 class="text-white font-semibold mb-3">🐺 Choose Your Target</h3>
  //             <div class="space-y-2">
  //               {alivePlayers().filter(p => p.id !== 'me').map(player => (
  //                 <button
  //                   key={player.id}
  //                   class="w-full text-left p-3 bg-white/10 hover:bg-red-600/30 text-white rounded-lg transition-colors"
  //                 >
  //                   {player.name}
  //                 </button>
  //               ))}
  //             </div>
  //           </div>
  //         )} */}

  //         {/* {gamePhase === 'night' && myRole === 'seer' && (
  //           <div class="bg-blue-600/20 backdrop-blur-lg rounded-2xl p-4 mb-6">
  //             <h3 class="text-white font-semibold mb-3">👁️ Investigate Someone</h3>
  //             <div class="space-y-2">
  //               {alivePlayers.filter(p => p.id !== 'me').map(player => (
  //                 <button
  //                   key={player.id}
  //                   class="w-full text-left p-3 bg-white/10 hover:bg-blue-600/30 text-white rounded-lg transition-colors"
  //                 >
  //                   {player.name}
  //                 </button>
  //               ))}
  //             </div>
  //           </div>
  //         )} */}

  //         {/* {gamePhase === 'day' && (
  //           <div class="bg-orange-600/20 backdrop-blur-lg rounded-2xl p-4 mb-6">
  //             <h3 class="text-white font-semibold mb-3">🗳️ Vote to Eliminate</h3>
  //             <select
  //               value={voteTarget}
  //               onChange={(e) => setVoteTarget(e.target.value)}
  //               class="w-full p-3 bg-white/10 text-white rounded-lg border border-white/20 mb-3"
  //             >
  //               <option value="">Choose someone to vote out...</option>
  //               {alivePlayers.filter(p => p.id !== 'me').map(player => (
  //                 <option key={player.id} value={player.name}>{player.name}</option>
  //               ))}
  //             </select>
  //             <button
  //               onClick={submitVote}
  //               disabled={!voteTarget}
  //               class="w-full py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors"
  //             >
  //               Submit Vote
  //             </button>
  //           </div>
  //         )} */}

  //         {/* Game Events */}
  //         <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-4 mb-6 max-h-40 overflow-y-auto">
  //           <h3 class="text-white font-semibold mb-3">Game Events</h3>
  //           <div class="space-y-2">
  //             {gameEvents().slice(-5).map((event, index) => (
  //               <div class="text-sm text-white/80">
  //                 • {event.message}
  //               </div>
  //             ))}
  //           </div>
  //         </div>

  //         {/* Phase Control (Host only) */}
  //         {isHost() && (
  //           <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-4">
  //             <button
  //               class={`w-full py-3 rounded-lg font-semibold text-white transition-colors ${
  //                 gamePhase() === 'night'
  //                   ? 'bg-yellow-600 hover:bg-yellow-700'
  //                   : 'bg-indigo-600 hover:bg-indigo-700'
  //               }`}
  //             >
  //               {gamePhase() === 'night' ? 'Start Day Phase' : 'Start Night Phase'}
  //             </button>
  //           </div>
  //         )}
  //       </div>
  //     </div>
  //   );
  // }
}
