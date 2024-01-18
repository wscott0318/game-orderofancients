
import { Vector3 } from "three";

import { ROUND_TIME } from "../../constants";
import { PlayerState } from "../States/PlayerState";
import { TowerManager } from "./TowerManager";
import { TextSprite } from "../gfx/sprites/Text";
import { SpriteManager } from "./SpriteManager";
import { EventBridge } from "../../libs/EventBridge";
import { Events } from "../../constants/GameEvents";
import { Game } from "../Game";

//

interface TimeManagerProps {
    playerState: PlayerState;
    towerManager: TowerManager;
    spriteManager: SpriteManager;
};

export class TimeManager {

    public secondTracker: number;
    public roundTracker: number;
    public totalTimeTracker: number;
    public playerState: PlayerState;
    public towerManager: TowerManager;
    public spriteManager: SpriteManager;

    //

    constructor( params: TimeManagerProps ) {

        this.secondTracker = 1;
        this.roundTracker = ROUND_TIME;
        this.totalTimeTracker = 0;

        this.playerState = params.playerState;
        this.towerManager = params.towerManager;
        this.spriteManager = params.spriteManager;

    }

    public tickSecond ( value: number ) : void {

        this.secondTracker = 1;

        const sprite = new TextSprite({
            gameScene: Game.instance.gameScene,
            text: `+${value}`,
            color: `#EED734`,
            position: new Vector3(
                this.towerManager._towerMesh.position.x,
                this.towerManager._towerMesh.position.y + 5,
                this.towerManager._towerMesh.position.z
            ),
            fastMode: false,
        });

        this.spriteManager.addTextSprite(sprite);

        const divEl = document.getElementById("income");

        if ( divEl ) {

            divEl.textContent = `+ ${value}`;

        }

    }

    public tickRound () : void {

        this.towerManager.levelUp();

        this.roundTracker = ROUND_TIME;

        const barDiv = document.getElementById("timeBar");

        if ( barDiv ) {

            const temp = barDiv.style.transition;
            barDiv.style.transition = "none";

            setTimeout(() => {
                barDiv.style.transition = temp;
            }, 50);

        }

    };

    public tick () : void {

        this.playerState.updateGoldUI();

        EventBridge.dispatchToUI( Events.Game.UPDATE_TIME, {
            totalTimeTracker:   this.totalTimeTracker,
            roundTracker:       this.roundTracker
        });

    }

}
