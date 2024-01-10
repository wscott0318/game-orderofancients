import * as THREE from "three";
import { ROUND_TIME } from "../../constants";
import { PlayerState } from "../States/PlayerState";
import { TowerManager } from "./TowerManager";
import { TextSprite } from "../Sprites/Text";
import { SceneRenderer } from "../rendering/SceneRenderer";
import { SpriteManager } from "./SpriteManager";
import { CONVERT_TIME } from "../../utils/helper";
import { Game } from "../game";
import { uiBridge } from "../../libs/UIBridge";
import { UI_EVENTS } from "../../constants/GameUIEvents";

interface TimeManagerProps {
    playerState: PlayerState;
    towerManager: TowerManager;
    sceneRenderer: SceneRenderer;
    spriteManager: SpriteManager;
}

export class TimeManager {
    secondTracker: number;
    roundTracker: number;
    totalTimeTracker: number;
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
        this.secondTracker = 1;
        this.roundTracker = ROUND_TIME;
        this.totalTimeTracker = 0;

        this.playerState = playerState;
        this.towerManager = towerManager;
        this.sceneRenderer = sceneRenderer;
        this.spriteManager = spriteManager;
    }

    tickSecond(value: number) {
        this.secondTracker = 1;

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

        this.roundTracker = ROUND_TIME;

        const barDiv = document.getElementById("timeBar");
        if (barDiv) {
            const temp = barDiv.style.transition;
            barDiv.style.transition = "none";

            setTimeout(() => {
                barDiv.style.transition = temp;
            }, 50);
        }
    }

    tick () {

        this.playerState.updateGoldUI();

        uiBridge.dispatchToUI( UI_EVENTS.UPDATE_TIME, {
            totalTimeTracker:   this.totalTimeTracker,
            roundTracker:       this.roundTracker
        });

    }

}
