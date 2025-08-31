export const roleDefinitions: Record<Role, RoleDefinition> = {
  werewolf: {
    name: 'Werewolf',
    description: 'You are a werewolf.',
    team: 'werewolf',
    nightAction: 'Look at the other werewolves and choose someone to eliminate.',
    winCondition: 'Win if no werewolves are eliminated during the day.',
    priority: 1,
    color: 'text-red-600', // Tailwind red-600
    backgroundColor: 'bg-red-100', // Tailwind red-100
    icon: '🐺'
  },
  
  villager: {
    name: 'Villager',
    description: 'You are an ordinary villager with no special powers.',
    team: 'village',
    winCondition: 'Win if at least one werewolf is eliminated during the day.',
    priority: 99, // No night action
    color: 'text-green-600', // Tailwind green-600
    backgroundColor: 'bg-green-100', // Tailwind green-100
    icon: '👨‍🌾'
  },
  
  seer: {
    name: 'Seer',
    description: 'You can see the true identity of other players.',
    team: 'village',
    nightAction: 'Look at another player\'s card OR look at two cards from the center.',
    winCondition: 'Win if at least one werewolf is eliminated during the day.',
    priority: 2,
    color: 'text-purple-600', // Tailwind purple-600
    backgroundColor: 'bg-purple-100', // Tailwind purple-100
    icon: '🔮'
  },
  
  troublemaker: {
    name: 'Troublemaker',
    description: 'You can swap the cards of two other players.',
    team: 'village',
    nightAction: 'Choose two other players to swap their cards.',
    winCondition: 'Win if at least one werewolf is eliminated during the day.',
    priority: 4,
    color: 'text-orange-600', // Tailwind orange-600
    backgroundColor: 'bg-orange-100', // Tailwind orange-100
    icon: '🃏'
  },
  
  robber: {
    name: 'Robber',
    description: 'You can steal another player\'s role.',
    team: 'village',
    nightAction: 'Choose another player to swap cards with and look at your new card.',
    winCondition: 'Win based on your final role (if you steal werewolf, you become werewolf).',
    priority: 3,
    color: 'text-cyan-600', // Tailwind cyan-600
    backgroundColor: 'bg-cyan-100', // Tailwind cyan-100
    icon: '🥷'
  }
};
