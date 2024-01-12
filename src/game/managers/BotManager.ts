import { AssetsManager } from "./AssetsManager";
import { Bot } from "../Instances/Bot";
import { SceneRenderer } from "../rendering/SceneRenderer";

//

export class BotManager {

    public botArray: Bot[];
    public index: number;
    public sceneRenderer: SceneRenderer;
    public assetsManager: AssetsManager;

    //

    constructor ( { sceneRenderer, assetsManager, index }: any ) {

        this.botArray = [];
        this.index = index;
        this.sceneRenderer = sceneRenderer;
        this.assetsManager = assetsManager;

    }

    public addNewBot ( { botType }: any ) {

        this.botArray.push(
            new Bot({
                sceneRenderer: this.sceneRenderer,
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
