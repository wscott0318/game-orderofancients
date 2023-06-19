import { Sprite } from "./Instances/Sprite";
import { TextSprite } from "./Sprites/Text";

export class SpriteManager {
    spriteArray: any;
    textSpriteArray: any;

    constructor() {
        this.spriteArray = [];

        this.textSpriteArray = [];
    }

    addSprite(sprite: any) {
        this.spriteArray.push(sprite);
    }

    addTextSprite(sprite: TextSprite) {
        this.textSpriteArray.push(sprite);
    }

    validateTextSprites() {
        const newArray = this.textSpriteArray.filter(
            (sprite: TextSprite) => !sprite.shouldRemove
        );

        this.textSpriteArray = [...newArray];
    }

    tick() {
        for (let i = 0; i < this.spriteArray.length; i++) {
            this.spriteArray[i].tick();
        }

        this.validateTextSprites();

        for (let i = 0; i < this.textSpriteArray.length; i++)
            this.textSpriteArray[i].tick();
    }
}

export default SpriteManager;
