export type TowerStatus = {
    level: number;
    maxHp: number;
    hp: number;
    isDead: boolean;
    gold: number;
};

export type TimerStatus = {
    secondTracker: number;
    roundTracker: number;
    totalTimeTracker: number;
};

export type BotStatus = {
    hp: number;
    position: THREE.Vector3;
    status: number;
    oldStatus: number;
    claimTime: number;
    canRemove: boolean;
    stunTime: number;
    slowTime: number;
    fireTime: number;
};
