import AssetsManager from "./AssetsManager";
import { Bot } from "../Instances/Bot";
import { SceneRenderer } from "../rendering/SceneRenderer";

export class BotManager {
    botArray: Bot[];
    index: number;
    sceneRenderer: SceneRenderer;
    assetsManager: AssetsManager;

    constructor({ sceneRenderer, assetsManager, index }: any) {
        this.botArray = [];
        this.index = index;
        this.sceneRenderer = sceneRenderer;
        this.assetsManager = assetsManager;
    }

    addNewBot({ botType }: any) {
        this.botArray.push(
            new Bot({
                sceneRenderer: this.sceneRenderer,
                assetsManager: this.assetsManager,
                botType: botType,
                towerIndex: this.index,
            })
        );
    }

    tick() {
        for (let i = 0; i < this.botArray.length; i++) this.botArray[i].tick();
    }
}
