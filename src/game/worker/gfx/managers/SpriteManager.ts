
import { Vector3 } from "three";

import { NewSpriteInfo, NewTextSpriteInfo } from "../../../../constants/type";
import { TextSprite } from "../sprites/Text";
import Boulder from "../sprites/weapons/Boulder";
import Bow from "../sprites/weapons/Bow";
import ChaosClaw from "../sprites/weapons/ChaosClaw";
import ChaosOrb from "../sprites/weapons/ChaosOrb";
import FireBow from "../sprites/weapons/FireBow";
import Flamecaster from "../sprites/weapons/FlameCaster";
import FrostBow from "../sprites/weapons/FrostBow";
import MagicMissiles from "../sprites/weapons/MagicMissiles";
import MissileBarrage from "../sprites/weapons/MissileBarrage";
import Rifle from "../sprites/weapons/Rifle";
import ThrowingAxe from "../sprites/weapons/ThrowingAxe";
import { GameScene } from "..";

//

type SpriteManagerProps = {
    gameScene: GameScene;
};

export class SpriteManager {

    public spriteArray: any;
    public textSpriteArray: any;
    public gameScene: GameScene;

    //

    constructor( { gameScene }: SpriteManagerProps ) {

        this.spriteArray = [];
        this.textSpriteArray = [];
        this.gameScene = gameScene;

    }

    public addSpriteFrom ( newSpriteInfo: NewSpriteInfo ) : void {

        let sprite = null;
        const weaponName = newSpriteInfo.name;

        switch ( weaponName ) {
            case "Throwing Axes":
                sprite = new ThrowingAxe({
                    gameScene: this.gameScene,
                    launchPos: newSpriteInfo.launchPos,
                    targetPos: new Vector3(
                        newSpriteInfo.targetPosition.x,
                        newSpriteInfo.targetPosition.y,
                        newSpriteInfo.targetPosition.z
                    ),
                    bounceCount: 0,
                });
                break;

            case "Seeker Axe":
                sprite = new ThrowingAxe({
                    gameScene: this.gameScene,
                    launchPos: newSpriteInfo.launchPos,
                    targetPos: new Vector3(
                        newSpriteInfo.targetPosition.x,
                        newSpriteInfo.targetPosition.y,
                        newSpriteInfo.targetPosition.z
                    ),
                    bounceCount: 0,
                });
                break;
            case "Rifle":
                sprite = new Rifle({
                    gameScene: this.gameScene,
                    launchPos: newSpriteInfo.launchPos,
                    targetPos: new Vector3(
                        newSpriteInfo.targetPosition.x,
                        newSpriteInfo.targetPosition.y,
                        newSpriteInfo.targetPosition.z
                    ),
                });
                break;

            case "Bow":
                sprite = new Bow({
                    gameScene: this.gameScene,
                    launchPos: newSpriteInfo.launchPos,
                    targetPos: new Vector3(
                        newSpriteInfo.targetPosition.x,
                        newSpriteInfo.targetPosition.y,
                        newSpriteInfo.targetPosition.z
                    ),
                });
                break;
            case "Frost Bow":
                sprite = new FrostBow({
                    gameScene: this.gameScene,
                    launchPos: newSpriteInfo.launchPos,
                    targetPos: new Vector3(
                        newSpriteInfo.targetPosition.x,
                        newSpriteInfo.targetPosition.y,
                        newSpriteInfo.targetPosition.z
                    ),
                });
                break;
            case "Fire Bow":
                sprite = new FireBow({
                    gameScene: this.gameScene,
                    launchPos: newSpriteInfo.launchPos,
                    targetPos: new Vector3(
                        newSpriteInfo.targetPosition.x,
                        newSpriteInfo.targetPosition.y,
                        newSpriteInfo.targetPosition.z
                    ),
                });
                break;

            case "Magic Missiles":
                sprite = new MagicMissiles({
                    gameScene: this.gameScene,
                    launchPos: newSpriteInfo.launchPos,
                    targetPos: new Vector3(
                        newSpriteInfo.targetPosition.x,
                        newSpriteInfo.targetPosition.y,
                        newSpriteInfo.targetPosition.z
                    ),
                });
                break;

            case "Flamecaster":
                sprite = new Flamecaster({
                    gameScene: this.gameScene,
                    launchPos: newSpriteInfo.launchPos,
                    targetPos: new Vector3(
                        newSpriteInfo.targetPosition.x,
                        newSpriteInfo.targetPosition.y,
                        newSpriteInfo.targetPosition.z
                    ),
                });
                break;

            case "Boulder":
                sprite = new Boulder({
                    gameScene: this.gameScene,
                    launchPos: newSpriteInfo.launchPos,
                    targetPos: new Vector3(
                        newSpriteInfo.targetPosition.x,
                        newSpriteInfo.targetPosition.y,
                        newSpriteInfo.targetPosition.z
                    ),
                });
                break;

            case "Missile Barrage":
                sprite = new MissileBarrage({
                    gameScene: this.gameScene,
                    launchPos: newSpriteInfo.launchPos,
                    targetPos: new Vector3(
                        newSpriteInfo.targetPosition.x,
                        newSpriteInfo.targetPosition.y,
                        newSpriteInfo.targetPosition.z
                    ),
                });
                break;

            case "Chaos Orb":
                sprite = new ChaosOrb({
                    gameScene: this.gameScene,
                    launchPos: newSpriteInfo.launchPos,
                    targetPos: new Vector3(
                        newSpriteInfo.targetPosition.x,
                        newSpriteInfo.targetPosition.y,
                        newSpriteInfo.targetPosition.z
                    ),
                });
                break;

            case "Chaos Claw":
                sprite = new ChaosClaw({
                    gameScene: this.gameScene,
                    launchPos: newSpriteInfo.launchPos,
                    targetPos: new Vector3(
                        newSpriteInfo.targetPosition.x,
                        newSpriteInfo.targetPosition.y,
                        newSpriteInfo.targetPosition.z
                    ),
                });
                break;
        }

        if ( sprite ) {

            this.addSprite( sprite );

        }

    }

    public addSprite ( sprite: any ) : void {

        this.spriteArray.push( sprite );

    }

    public addTextSpriteFrom ( newTextSpriteInfo: NewTextSpriteInfo ) : void {

        this.addTextSprite(
            new TextSprite({
                text: newTextSpriteInfo.text,
                color: newTextSpriteInfo.color,
                position: newTextSpriteInfo.position,
                gameScene: this.gameScene,
                fastMode: newTextSpriteInfo.fastMode === true,
            })
        );

    }

    public addTextSprite ( sprite: TextSprite ) : void {

        this.textSpriteArray.push( sprite );

    }

    public validateTextSprites () : void {

        const newArray = this.textSpriteArray.filter(
            (sprite: TextSprite) => !sprite.shouldRemove
        );

        this.textSpriteArray = [ ...newArray ];

    }

    public tick () : void {

        for ( let i = 0; i < this.spriteArray.length; i ++ ) {

            this.spriteArray[ i ].tick();

        }

        this.validateTextSprites();

        for ( let i = 0; i < this.textSpriteArray.length; i ++ ) {

            this.textSpriteArray[ i ].tick();

        }

    }

}
