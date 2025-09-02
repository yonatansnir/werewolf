import { createSignal } from "solid-js";

export const [player, setPlayer] = createSignal<Player | null>(null);
export const [game, setGame] = createSignal<Game | null>(null);
