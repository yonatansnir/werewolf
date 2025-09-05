import { createSignal } from "solid-js";

export const [playerId, setPlayerId] = createSignal<string | null>(null);
export const [game, setGame] = createSignal<Game | null>(null);
