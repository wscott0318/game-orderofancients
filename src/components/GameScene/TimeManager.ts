import * as THREE from "three";
import { ROUND_TIME, START_GOLD_GEN } from "../../constants";
import { PlayerState } from "./States/PlayerState";
import { TowerManager } from "./TowerManager";
import { TextSprite } from "./Sprites/Text";
import { SceneRenderer } from "./rendering/SceneRenderer";
import SpriteManager from "./SpriteManager";

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
        const value = START_GOLD_GEN + 5 * this.towerManager.level;

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
