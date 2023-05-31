export class PlayerState {
    gold: number;

    constructor() {
        this.gold = 0;
    }

    updateGoldUI() {
        (document.getElementById("gold") as any).textContent = this.gold;
    }

    increaseGold(amount: number) {
        this.gold += amount;

        this.updateGoldUI();
    }
}
