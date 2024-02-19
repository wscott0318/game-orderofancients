
import { Bot } from "../Instances/Bot";

//

export class BotManager {

    public botArray: Bot[];
    public index: number;

    //

    constructor ( { index }: any ) {

        this.botArray = [];
        this.index = index;

    }

    public addNewBot ( { botType }: any ) {

        this.botArray.push(
            new Bot({
                botType: botType,
                towerIndex: this.index,
            })
        );

    }

    public tick () : void {

        for ( let i = 0; i < this.botArray.length; i ++ ) {

            this.botArray[i].tick();

        }

    }

}
