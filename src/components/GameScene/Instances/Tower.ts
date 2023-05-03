export class Tower {
    level: number;
    maxHp: number;
    hp: number;
    attackSpeed: number;
    attackRange: number;
    damage: number;

    constructor() {
        this.level = 1;
        this.hp = 700;
        this.maxHp = 700;
        this.attackSpeed = 30;
        this.damage = 200;
        this.attackRange = 20;
    }
}
