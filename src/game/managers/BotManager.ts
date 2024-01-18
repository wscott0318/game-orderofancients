
import { AssetsManager } from "./AssetsManager";
import { Bot } from "../Instances/Bot";

//

export class BotManager {

    public botArray: Bot[];
    public index: number;
    public assetsManager: AssetsManager;

    //

    constructor ( { assetsManager, index }: any ) {

        this.botArray = [];
        this.index = index;
        this.assetsManager = assetsManager;

    }

    public addNewBot ( { botType }: any ) {

        this.botArray.push(
            new Bot({
                assetsManager: this.assetsManager,
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
