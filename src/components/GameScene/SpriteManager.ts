import { Sprite } from "./Instances/Sprite";

export class SpriteManager {
    spriteArray: any;

    constructor() {
        this.spriteArray = [];
    }

    addSprite(sprite: Sprite) {
        this.spriteArray.push(sprite);
    }

    remoteSprite(sprite: Sprite) {
        const index = this.spriteArray.findIndex(
            (item: any) => item.id === sprite.id
        );
        if (index !== -1) this.spriteArray.splice(index, 1);
    }

    tick() {
        for (let i = 0; i < this.spriteArray.length; i++) {
            this.spriteArray[i].tick();
        }
    }
}

export default SpriteManager;
