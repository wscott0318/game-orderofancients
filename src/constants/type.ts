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

export type NewSpriteInfo = {
    name: string;
    launchPos: THREE.Vector3;
    targetPosition: {
        x: number;
        y: number;
        z: number;
    };
    bounceCount?: number;
};

export type NewTextSpriteInfo = {
    text: string;
    color: string;
    position: THREE.Vector3;
    fastMode?: boolean;
};

export type SpriteStatus = {
    targetPos: {
        x: number;
        y: number;
        z: number;
    };
    position: THREE.Vector3;
    bounceCount: number;
};
