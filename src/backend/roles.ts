export const roleDefinitions: Record<
  Role,
  { name: string; description: string; team: Team }
> = {
  werewolf: {
    name: "Werewolf",
    description:
      "You are a werewolf! Work with other werewolves to eliminate villagers. You wake up at night to choose who to eliminate.",
    team: "werewolf",
  },
  seer: {
    name: "Seer",
    description:
      "You are the Seer! Each night you can look at another player's card or look at two of the center cards to gain information.",
    team: "village",
  },
  troublemaker: {
    name: "Troublemaker",
    description:
      "You are the Troublemaker! At night you must choose two other players and swap their cards without looking at them.",
    team: "village",
  },
  villager: {
    name: "Villager",
    description:
      "You are a Villager! You have no special night action, but you must help identify and vote out the werewolves during the day.",
    team: "village",
  },
  robber: {
    name: "Robber",
    description:
      "You are the Robber! At night you may choose another player and swap your card with theirs, then look at your new card.",
    team: "village",
  },
} as const;
