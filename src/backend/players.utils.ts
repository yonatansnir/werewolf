
export function generatePlayer(playerName: string, isHost: boolean): Player {
    return {
        id: Math.random().toString(36).substring(2, 8),
        playerName,
        connected: true,
        role: 'villager',
        team: 'village',
        isHost,
    };
}