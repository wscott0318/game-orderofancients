import { SPELLS_INFO } from "../../../constants/spell";
import { GET_RANDOM_VAL } from "../../../helper/math";
import { PERCENT2VALUE } from "../../../utils/helper";

export class PlayerState {
    gold: number;

    // Normal Weapon Spells
    Throwing_Axes: number;
    Shockwave_Axe: number;
    Seeker_Axe: number;
    Rifle: number;
    Poison_Spear: number;
    Storm_Hammer: number;
    Thorn: number;
    Quills: number;
    Net_Thrower: number;
    Holy_Bolt: number;

    // Piercing Weapon Spells
    Bow: number;
    Frost_Bow: number;
    Fire_Bow: number;
    Serpent: number;
    Knives: number;
    Moon_Glaive: number;
    Splasher: number;
    Glaive_Thrower: number;
    Poison_Bow: number;
    Snapper: number;

    // Magic Weapon Spells
    Magic_Missiles: number;
    Magic_Claw: number;
    Living_Water: number;
    Arcane_Blaster: number;
    Living_Ice: number;
    Soulstealer: number;
    Flamecaster: number;
    Magic_Bolt: number;
    Lightning_Generator: number;

    // Siege Weapon Spells
    Boulder: number;
    Bombs: number;
    Mortar_Launcher: number;
    Blaster: number;
    Missile_Barrage: number;
    Steam_Cannon: number;
    Cluster_Rockets: number;
    Meatapult: number;
    Poison_Bomb: number;

    // Chaos Weapon Spells
    Chaos_Orb: number;
    Chaos_Heart: number;
    Chaos_Claw: number;
    Crippler: number;
    Demon_Eye: number;
    Healthstone: number;
    Chaos_Swarm: number;
    Vengeful_Coil: number;
    Immolation: number;

    Weapons: any;

    // Gold upgrades
    Magic_Coin: number;
    Bounty_Hunter: number;
    Transmute: number;
    Philosopher_Stone: number;
    Underground_Gold_Mine: number;
    Gems_of_Power: number;

    constructor() {
        this.gold = 5000;

        // Normal
        this.Throwing_Axes = 0;
        this.Shockwave_Axe = 0;
        this.Seeker_Axe = 0;
        this.Rifle = 0;
        this.Poison_Spear = 0;
        this.Storm_Hammer = 0;
        this.Thorn = 0;
        this.Quills = 0;
        this.Net_Thrower = 0;
        this.Holy_Bolt = 0;

        // Piercing
        this.Bow = 0;
        this.Frost_Bow = 0;
        this.Fire_Bow = 0;
        this.Serpent = 0;
        this.Knives = 0;
        this.Moon_Glaive = 0;
        this.Splasher = 0;
        this.Glaive_Thrower = 0;
        this.Poison_Bow = 0;
        this.Snapper = 0;

        // Magic
        this.Magic_Missiles = 0;
        this.Magic_Claw = 0;
        this.Living_Water = 0;
        this.Arcane_Blaster = 0;
        this.Living_Ice = 0;
        this.Soulstealer = 0;
        this.Flamecaster = 0;
        this.Magic_Bolt = 0;
        this.Lightning_Generator = 0;

        // Siege
        this.Boulder = 0;
        this.Bombs = 0;
        this.Mortar_Launcher = 0;
        this.Blaster = 0;
        this.Missile_Barrage = 0;
        this.Steam_Cannon = 0;
        this.Cluster_Rockets = 0;
        this.Meatapult = 0;
        this.Poison_Bomb = 0;

        // Chaos
        this.Chaos_Orb = 0;
        this.Chaos_Heart = 0;
        this.Chaos_Claw = 0;
        this.Crippler = 0;
        this.Demon_Eye = 0;
        this.Healthstone = 0;
        this.Chaos_Swarm = 0;
        this.Vengeful_Coil = 0;
        this.Immolation = 0;

        this.Weapons = [];

        // Gold upgrades
        this.Magic_Coin = 0;
        this.Bounty_Hunter = 0;
        this.Transmute = 0;
        this.Philosopher_Stone = 0;
        this.Underground_Gold_Mine = 0;
        this.Gems_of_Power = 0;
    }

    updateGoldUI() {
        (document.getElementById("gold") as any).textContent = this.gold;
    }

    increaseGold(amount: number) {
        this.gold += amount;

        this.updateGoldUI();
    }

    decreaseGold(amount: number) {
        this.gold -= amount;

        this.updateGoldUI();
    }

    upgradeSpell(spell: any) {
        this.decreaseGold(spell.cost);

        if (spell.name === "Gems of Power") {
            this.Gems_of_Power = SPELLS_INFO.Gems_of_Power.chargeCount;
        } else if (spell.name === "Magic Coin") {
            this.Magic_Coin += this.Gems_of_Power > 0 ? this.Gems_of_Power : 1;
        } else {
            (this as any)[spell.propertyName]++;
        }

        if (spell.spellType === "Weapon") {
            this.Weapons.push({
                ...spell,
                reloadTime: 0,
            });
        }
    }

    increaseBotKilledGold(amount: number) {
        let value = amount;

        // Handling for "Bounty Hunter" Upgrade
        for (let i = 0; i < this.Bounty_Hunter; i++) {
            value = value + value * PERCENT2VALUE(50); // Grant 50% additional gold
        }

        // Handling for "Transmute" Upgrade
        for (let i = 0; i < this.Transmute; i++) {
            value = value + value * PERCENT2VALUE(50);

            if (GET_RANDOM_VAL(20) === 0)
                // Grant +200% gold by 5% chance
                value = value + value * PERCENT2VALUE(200);
        }

        return value;
    }

    increaseUpgradeGold(item: any) {
        if (item.name === `Philosopher's Stone`) {
            this.increaseGold(SPELLS_INFO[`Philosopher's Stone`].cost);
        } else if (item.name === "Cursed Treasure") {
            this.increaseGold(SPELLS_INFO[`Cursed_Treasure`].cost);
        }

        let gold = ((SPELLS_INFO as any)[item.propertyName] as any).gold;

        for (let i = 0; i < this.Underground_Gold_Mine; i++) {
            gold *= PERCENT2VALUE(110);
        }

        this.increaseGold(gold);
    }
}
