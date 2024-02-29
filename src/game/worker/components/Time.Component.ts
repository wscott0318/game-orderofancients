
import { Vector3 } from "three";

import { ROUND_TIME } from "../../../constants";
import { TextSprite } from "../gfx/sprites/Text";
import { EventBridge } from "../../../libs/EventBridge";
import { Events } from "../../../constants/GameEvents";
import { TowerEntity } from "../entities/Tower.Entity";
import { GameWorker } from "../GameWorker";

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
            gameScene: GameWorker.gameScene,
            text: `+${value}`,
            color: `#EED734`,
            position: new Vector3(
                this.tower.towerMesh.position.x,
                this.tower.towerMesh.position.y + 5,
                this.tower.towerMesh.position.z
            ),
            fastMode: false,
        });

        GameWorker._spriteManager.addTextSprite( sprite );

        EventBridge.dispatchToUI( 'updateIncome', value );

    };

    public tickRound () : void {

        this.tower.levelUp();

        this.roundTracker = ROUND_TIME;

        EventBridge.dispatchToUI( 'tickRound' );

    };

    public tick () : void {

        this.tower.playerState.updateGoldUI();

        EventBridge.dispatchToUI( Events.Game.UPDATE_TIME, {
            totalTimeTracker:   this.totalTimeTracker,
            roundTracker:       this.roundTracker
        });

    };

};
