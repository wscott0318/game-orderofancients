
import { Vector3 } from "three";

import { NewSpriteInfo, NewTextSpriteInfo } from "../../constants/type";
import { AssetsManager } from "./AssetsManager";
import { TextSprite } from "../gfx/sprites/Text";
import Boulder from "../gfx/sprites/weapons/Boulder";
import Bow from "../gfx/sprites/weapons/Bow";
import ChaosClaw from "../gfx/sprites/weapons/ChaosClaw";
import ChaosOrb from "../gfx/sprites/weapons/ChaosOrb";
import FireBow from "../gfx/sprites/weapons/FireBow";
import Flamecaster from "../gfx/sprites/weapons/FlameCaster";
import FrostBow from "../gfx/sprites/weapons/FrostBow";
import MagicMissiles from "../gfx/sprites/weapons/MagicMissiles";
import MissileBarrage from "../gfx/sprites/weapons/MissileBarrage";
import Rifle from "../gfx/sprites/weapons/Rifle";
import ThrowingAxe from "../gfx/sprites/weapons/ThrowingAxe";
import { GameScene } from "../gfx";

//

type SpriteManagerProps = {
    gameScene: GameScene;
    assetsManager: AssetsManager;
};

export class SpriteManager {

    public spriteArray: any;
    public textSpriteArray: any;
    public gameScene: GameScene;
    public assetsManager: AssetsManager;

    //

    constructor( { gameScene, assetsManager }: SpriteManagerProps ) {

        this.spriteArray = [];
        this.textSpriteArray = [];
        this.gameScene = gameScene;
        this.assetsManager = assetsManager;

    }

    public addSpriteFrom ( newSpriteInfo: NewSpriteInfo ) : void {

        let sprite = null;
        const weaponName = newSpriteInfo.name;

        switch ( weaponName ) {
            case "Throwing Axes":
                sprite = new ThrowingAxe({
                    gameScene: this.gameScene,
                    assetsManager: this.assetsManager,
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
                    assetsManager: this.assetsManager,
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
                    assetsManager: this.assetsManager,
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
                    assetsManager: this.assetsManager,
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
                    assetsManager: this.assetsManager,
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
                    assetsManager: this.assetsManager,
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
                    assetsManager: this.assetsManager,
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
                    assetsManager: this.assetsManager,
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
                    assetsManager: this.assetsManager,
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
                    assetsManager: this.assetsManager,
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
                    assetsManager: this.assetsManager,
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
                    assetsManager: this.assetsManager,
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
