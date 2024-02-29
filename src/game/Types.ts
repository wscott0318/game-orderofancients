
export type spell = {
    name: string;
    propertyName: string;
    spellType: string;
    thumbnail: string;
    cost: string;
    damageType: number;
    attackRange: number;
    targetType: string;
    targetPreference: number;
    attackDamage: number;
    dps: number;
    cooldown: number;
    BounceCount?: number;
    stunDuration?: number;
    slowTime?: number;
    duration?: number;
    targetCount?: number;
    upgradeType?: string;
    gold?: number;
    description?: string;
    effect?: number;
    sacrifiHealth?: number;
    chargeCount?: number;
};

export interface PlayerInfo {
    socketId: string;
    upgrades: spell[];
};

export interface LobbyInfo {
    id: string;
    players: PlayerInfo[];
    status: number;
};
