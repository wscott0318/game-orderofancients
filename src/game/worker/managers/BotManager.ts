
import { BotEntity } from "../entities/Bot.Entity";

//

export class BotManager {

    public bots: BotEntity[] = [];

    private towerIndex: number;

    //

    constructor ( towerIndex: number ) {

        this.towerIndex = towerIndex;

    };

    public add ( botType: number ) : void {

        const bot = new BotEntity( botType, this.towerIndex );
        this.bots.push( bot );

    };

    public killAll () : void {

        for ( let i = 0; i < this.bots.length; i ++ ) {

            this.bots[ i ].kill();

        }

        this.bots = [];

    };

    public update () : void {

        for ( let i = 0; i < this.bots.length; i ++ ) {

            this.bots[ i ].tick();

        }

    };

    public dispose () : void {

        this.killAll();

    };

};
