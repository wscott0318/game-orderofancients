export const HEALTH_PIXEL = 0.1;

export const TOWER_HEALTH_WIDTH = 70;

export const TOWER_HEALTH_HEIGHT = 8;

export interface PlayerData {
    name: string;
    avata: string;
    color: string;
    level: number;
    kills: number;
    income: number;
    wins: number;
    lastStands: number;
}
