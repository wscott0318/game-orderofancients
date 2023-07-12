import * as THREE from "three";
import { ROUND_TIME, START_GOLD_GEN } from "../../constants";
import { PlayerState } from "./States/PlayerState";
import { TowerManager } from "./TowerManager";
import { TextSprite } from "./Sprites/Text";
import { SceneRenderer } from "./rendering/SceneRenderer";
import SpriteManager from "./SpriteManager";
import { SPELLS_INFO } from "../../constants/spell";
import { PERCENT2VALUE } from "../../utils/helper";

interface TimeManagerProps {
    playerState: PlayerState;
    towerManager: TowerManager;
    sceneRenderer: SceneRenderer;
    spriteManager: SpriteManager;
}

export class TimeManager {
    clock: THREE.Clock;
    secondTracker: number;
    roundTracker: number;
    playerState: PlayerState;
    towerManager: TowerManager;
    sceneRenderer: SceneRenderer;
    spriteManager: SpriteManager;

    constructor({
        playerState,
        towerManager,
        sceneRenderer,
        spriteManager,
    }: TimeManagerProps) {
        this.clock = new THREE.Clock();

        this.secondTracker = 1;
        this.roundTracker = ROUND_TIME;

        this.playerState = playerState;
        this.towerManager = towerManager;
        this.sceneRenderer = sceneRenderer;
        this.spriteManager = spriteManager;
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
    }

    tickRound() {
        this.towerManager.levelUp();

        // Games of Power: 1 less additional upgrade if you don't use it right away
        if (this.playerState.Gems_of_Power > 0) {
            this.playerState.Gems_of_Power--;
        }
    }

    tick() {
        const delta = this.clock.getDelta();

        this.secondTracker -= delta;
        this.roundTracker -= delta;

        if (this.secondTracker < 0) {
            this.secondTracker = 1;

            this.tickSecond();
        }

        if (this.roundTracker < 0) {
            this.roundTracker = ROUND_TIME;

            this.tickRound();
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
