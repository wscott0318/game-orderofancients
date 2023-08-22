import { BOT_TYPE } from "../../constants/bot";
import { GET_RANDOM_VAL } from "../../helper/math";
import AssetsManager from "./AssetsManager";
import { Bot } from "./Instances/Bot";
import { SceneRenderer } from "./rendering/SceneRenderer";

export class BotManager {
    botArray: Bot[];
    level: number;
    sceneRenderer: SceneRenderer;
    assetsManager: AssetsManager;
    botProduceTime: number;
    botClaimTime: number;

    constructor({ sceneRenderer, assetsManager }: any) {
        this.botArray = [];
        this.level = 1;
        this.sceneRenderer = sceneRenderer;
        this.assetsManager = assetsManager;
        this.botProduceTime = 150;
        this.botClaimTime = 0;
    }

    produceBots(count: number) {
        for (let i = 0; i < count; i++) {
            const botTypes = Object.keys(BOT_TYPE);
            const typeIndex = GET_RANDOM_VAL(botTypes.length);
            const type = botTypes[typeIndex];

            this.botArray.push(
                new Bot({
                    sceneRenderer: this.sceneRenderer,
                    assetsManager: this.assetsManager,
                    botType: BOT_TYPE[type],
                })
            );
        }
    }

    tick() {
        this.botProduceTime -= 0.01 * this.level;

        this.botClaimTime--;
        if (this.botClaimTime < 0) {
            this.botClaimTime = this.botProduceTime;
            this.produceBots(GET_RANDOM_VAL(5 + this.level) + 1);
        }

        for (let i = 0; i < this.botArray.length; i++) this.botArray[i].tick();
    }
}
