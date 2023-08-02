import * as THREE from "three";
import { ROUND_TIME, START_GOLD_GEN } from "../../constants";
import { PlayerState } from "./States/PlayerState";
import { TowerManager } from "./TowerManager";
import { TextSprite } from "./Sprites/Text";
import { SceneRenderer } from "./rendering/SceneRenderer";
import SpriteManager from "./SpriteManager";
import { SPELLS_INFO } from "../../constants/spell";
import { CONVERT_TIME, PERCENT2VALUE } from "../../utils/helper";
import { generateUpgrades } from "../../helper/game";

interface TimeManagerProps {
    playerState: PlayerState;
    towerManager: TowerManager;
    sceneRenderer: SceneRenderer;
    spriteManager: SpriteManager;
    setUpgrades: Function;
}

export class TimeManager {
    clock: THREE.Clock;
    secondTracker: number;
    roundTracker: number;
    totalTimeTracker: number;
    playerState: PlayerState;
    towerManager: TowerManager;
    sceneRenderer: SceneRenderer;
    spriteManager: SpriteManager;
    setUpgrades: Function;

    constructor({
        playerState,
        towerManager,
        sceneRenderer,
        spriteManager,
        setUpgrades,
    }: TimeManagerProps) {
        this.clock = new THREE.Clock();

        this.secondTracker = 1;
        this.roundTracker = ROUND_TIME;
        this.totalTimeTracker = 0;

        this.playerState = playerState;
        this.towerManager = towerManager;
        this.sceneRenderer = sceneRenderer;
        this.spriteManager = spriteManager;

        this.setUpgrades = setUpgrades;
    }

    tickSecond() {
        // Default gold generation
        let value = START_GOLD_GEN + 5 * (this.towerManager.level - 1);

        // Magic Coin effect
        let magicCoinValue =
            this.playerState.Magic_Coin * SPELLS_INFO["Magic_Coin"].gold;
        value += magicCoinValue;

        // Gold Mine effect
        let goldMineValue =
            this.playerState.Underground_Gold_Mine *
            SPELLS_INFO["Underground_Gold_Mine"].gold;
        value += goldMineValue;

        for (let i = 0; i < this.playerState.Underground_Gold_Mine; i++) {
            value += magicCoinValue * PERCENT2VALUE(10);
            magicCoinValue += magicCoinValue * PERCENT2VALUE(10);

            value += goldMineValue * PERCENT2VALUE(10);
            goldMineValue += goldMineValue * PERCENT2VALUE(10);
        }

        this.playerState.increaseGold(value);

        const sprite = new TextSprite({
            text: `+${value}`,
            color: `#EED734`,
            position: new THREE.Vector3(
                this.towerManager._towerMesh.position.x,
                this.towerManager._towerMesh.position.y + 5,
                this.towerManager._towerMesh.position.z
            ),
            sceneRenderer: this.sceneRenderer,
            fastMode: false,
        });

        this.spriteManager.addTextSprite(sprite);

        const divEl = document.getElementById("income");
        if (divEl) {
            divEl.textContent = `+ ${value}`;
        }
    }

    tickRound() {
        this.towerManager.levelUp();

        // Games of Power: 1 less additional upgrade if you don't use it right away
        if (this.playerState.Gems_of_Power > 0) {
            this.playerState.Gems_of_Power--;
        }

        /**
         * Re-generate the spells for round
         */
        this.setUpgrades(generateUpgrades());
    }

    tick() {
        const delta = this.clock.getDelta();

        this.secondTracker -= delta;
        this.roundTracker -= delta;

        this.totalTimeTracker += delta;

        const totalTimeDiv = document.getElementById("elapsedTime");
        if (totalTimeDiv) {
            totalTimeDiv.textContent = CONVERT_TIME(
                Math.floor(this.totalTimeTracker)
            );
        }

        const barDiv = document.getElementById("timeBar");
        if (barDiv) {
            barDiv.style.width = `${(this.roundTracker / ROUND_TIME) * 100}%`;
        }

        if (this.secondTracker < 0) {
            this.secondTracker = 1;

            this.tickSecond();
        }

        if (this.roundTracker < 0) {
            this.roundTracker = ROUND_TIME;

            this.tickRound();

            if (barDiv) {
                const temp = barDiv.style.transition;
                barDiv.style.transition = "none";

                setTimeout(() => {
                    barDiv.style.transition = temp;
                }, 50);
            }
        }

        const divEl = document.getElementById("remainingRoundTime");
        if (divEl) {
            divEl.textContent = `${Math.ceil(this.roundTracker)}s`;
        }

        /**
         * Reload Weapons Cooldown.
         */
        for (let i = 0; i < this.playerState.Weapons.length; i++) {
            const weapon = this.playerState.Weapons[i];

            if (weapon.reloadTime > 0) {
                weapon.reloadTime -= delta;
                weapon.reloadTime =
                    weapon.reloadTime < 0 ? 0 : weapon.reloadTime;
            }
        }
    }
}
