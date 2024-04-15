
import { Vector3 } from "three";

import { ROUND_TIME } from "../../../constants";
import { TextSprite } from "../gfx/sprites/Text";
import { TowerEntity } from "../entities/Tower.Entity";
import { GameWorker } from "../GameWorker";
import { GameEvents } from "../../Events";

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
            gameScene: GameWorker.arenaScene,
            text: `+${value}`,
            color: `#EED734`,
            position: new Vector3(
                this.tower.towerMesh.position.x,
                this.tower.towerMesh.position.y + 5,
                this.tower.towerMesh.position.z
            ),
            fastMode: false,
        });

        this.tower.playerState.income = value;
        GameWorker.arenaScene.spriteManager.addTextSprite( sprite );

        GameWorker.sendToMain( GameEvents.SET_PLAYER_INCOME, value );

    };

    public tickRound () : void {

        this.tower.levelUp();

        this.roundTracker = ROUND_TIME;

        GameWorker.sendToMain( GameEvents.TICK_ROUND );

    };

    public tick () : void {

        this.tower.updateGold();

        GameWorker.sendToMain( GameEvents.UPDATE_TIME, {
            totalTimeTracker:   this.totalTimeTracker,
            roundTracker:       this.roundTracker
        });

    };

};
