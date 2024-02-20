
import { Vector3 } from "three";

import { ROUND_TIME } from "../../constants";
import { TextSprite } from "../gfx/sprites/Text";
import { EventBridge } from "../../libs/EventBridge";
import { Events } from "../../constants/GameEvents";
import { Game } from "..";
import { TowerEntity } from "../entities/Tower.Entity";

//

interface TimeComponentProps {
    tower: TowerEntity;
};

export class TimeComponent {

    private tower: TowerEntity;

    public secondTracker: number;
    public roundTracker: number;
    public totalTimeTracker: number;

    //

    constructor ( params: TimeComponentProps ) {

        this.tower = params.tower;

        this.secondTracker = 1;
        this.roundTracker = ROUND_TIME;
        this.totalTimeTracker = 0;

    };

    public tickSecond ( value: number ) : void {

        this.secondTracker = 1;

        const sprite = new TextSprite({
            gameScene: Game.instance.gameScene,
            text: `+${value}`,
            color: `#EED734`,
            position: new Vector3(
                this.tower.towerMesh.position.x,
                this.tower.towerMesh.position.y + 5,
                this.tower.towerMesh.position.z
            ),
            fastMode: false,
        });

        Game.instance._spriteManager.addTextSprite(sprite);

        const divEl = document.getElementById("income");

        if ( divEl ) {

            divEl.textContent = `+ ${value}`;

        }

    };

    public tickRound () : void {

        this.tower.levelUp();

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

        this.tower.playerState.updateGoldUI();

        EventBridge.dispatchToUI( Events.Game.UPDATE_TIME, {
            totalTimeTracker:   this.totalTimeTracker,
            roundTracker:       this.roundTracker
        });

    };

};
