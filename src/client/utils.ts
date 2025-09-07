export const AVAILABLE_CARDS = [
  { id: 0, role: "villager" },
  { id: 1, role: "villager" },
  { id: 2, role: "villager" },
  { id: 3, role: "werewolf" },
  { id: 4, role: "werewolf" },
  { id: 5, role: "seer" },
  { id: 6, role: "robber" },
  { id: 7, role: "troublemaker" },
] as const;

export function getGameCards(cards: Set<number>): Role[] {
  return [...AVAILABLE_CARDS]
    .filter((card) => cards.has(card.id))
    .map((c) => c.role);
}
