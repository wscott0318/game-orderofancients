import * as THREE from "three";

import { NewSpriteInfo, NewTextSpriteInfo } from "../../constants/type";
import { AssetsManager } from "./AssetsManager";
import { TextSprite } from "../Sprites/Text";
import Boulder from "../Sprites/Weapons/Boulder";
import Bow from "../Sprites/Weapons/Bow";
import ChaosClaw from "../Sprites/Weapons/ChaosClaw";
import ChaosOrb from "../Sprites/Weapons/ChaosOrb";
import FireBow from "../Sprites/Weapons/FireBow";
import Flamecaster from "../Sprites/Weapons/FlameCaster";
import FrostBow from "../Sprites/Weapons/FrostBow";
import MagicMissiles from "../Sprites/Weapons/MagicMissiles";
import MissileBarrage from "../Sprites/Weapons/MissileBarrage";
import Rifle from "../Sprites/Weapons/Rifle";
import ThrowingAxe from "../Sprites/Weapons/ThrowingAxe";
import { SceneRenderer } from "../rendering/SceneRenderer";

//

type SpriteManagerProps = {
    sceneRenderer: SceneRenderer;
    assetsManager: AssetsManager;
};

export class SpriteManager {

    public spriteArray: any;
    public textSpriteArray: any;
    public sceneRenderer: SceneRenderer;
    public assetsManager: AssetsManager;

    //

    constructor( { sceneRenderer, assetsManager }: SpriteManagerProps ) {

        this.spriteArray = [];
        this.textSpriteArray = [];
        this.sceneRenderer = sceneRenderer;
        this.assetsManager = assetsManager;

    }

    public addSpriteFrom ( newSpriteInfo: NewSpriteInfo ) : void {

        let sprite = null;
        const weaponName = newSpriteInfo.name;

        switch ( weaponName ) {
            case "Throwing Axes":
                sprite = new ThrowingAxe({
                    sceneRenderer: this.sceneRenderer,
                    assetsManager: this.assetsManager,
                    launchPos: newSpriteInfo.launchPos,
                    targetPos: new THREE.Vector3(
                        newSpriteInfo.targetPosition.x,
                        newSpriteInfo.targetPosition.y,
                        newSpriteInfo.targetPosition.z
                    ),
                    bounceCount: 0,
                });
                break;

            case "Seeker Axe":
                sprite = new ThrowingAxe({
                    sceneRenderer: this.sceneRenderer,
                    assetsManager: this.assetsManager,
                    launchPos: newSpriteInfo.launchPos,
                    targetPos: new THREE.Vector3(
                        newSpriteInfo.targetPosition.x,
                        newSpriteInfo.targetPosition.y,
                        newSpriteInfo.targetPosition.z
                    ),
                    bounceCount: 0,
                });
                break;
            case "Rifle":
                sprite = new Rifle({
                    sceneRenderer: this.sceneRenderer,
                    assetsManager: this.assetsManager,
                    launchPos: newSpriteInfo.launchPos,
                    targetPos: new THREE.Vector3(
                        newSpriteInfo.targetPosition.x,
                        newSpriteInfo.targetPosition.y,
                        newSpriteInfo.targetPosition.z
                    ),
                });
                break;

            case "Bow":
                sprite = new Bow({
                    sceneRenderer: this.sceneRenderer,
                    assetsManager: this.assetsManager,
                    launchPos: newSpriteInfo.launchPos,
                    targetPos: new THREE.Vector3(
                        newSpriteInfo.targetPosition.x,
                        newSpriteInfo.targetPosition.y,
                        newSpriteInfo.targetPosition.z
                    ),
                });
                break;
            case "Frost Bow":
                sprite = new FrostBow({
                    sceneRenderer: this.sceneRenderer,
                    assetsManager: this.assetsManager,
                    launchPos: newSpriteInfo.launchPos,
                    targetPos: new THREE.Vector3(
                        newSpriteInfo.targetPosition.x,
                        newSpriteInfo.targetPosition.y,
                        newSpriteInfo.targetPosition.z
                    ),
                });
                break;
            case "Fire Bow":
                sprite = new FireBow({
                    sceneRenderer: this.sceneRenderer,
                    assetsManager: this.assetsManager,
                    launchPos: newSpriteInfo.launchPos,
                    targetPos: new THREE.Vector3(
                        newSpriteInfo.targetPosition.x,
                        newSpriteInfo.targetPosition.y,
                        newSpriteInfo.targetPosition.z
                    ),
                });
                break;

            case "Magic Missiles":
                sprite = new MagicMissiles({
                    sceneRenderer: this.sceneRenderer,
                    assetsManager: this.assetsManager,
                    launchPos: newSpriteInfo.launchPos,
                    targetPos: new THREE.Vector3(
                        newSpriteInfo.targetPosition.x,
                        newSpriteInfo.targetPosition.y,
                        newSpriteInfo.targetPosition.z
                    ),
                });
                break;

            case "Flamecaster":
                sprite = new Flamecaster({
                    sceneRenderer: this.sceneRenderer,
                    assetsManager: this.assetsManager,
                    launchPos: newSpriteInfo.launchPos,
                    targetPos: new THREE.Vector3(
                        newSpriteInfo.targetPosition.x,
                        newSpriteInfo.targetPosition.y,
                        newSpriteInfo.targetPosition.z
                    ),
                });
                break;

            case "Boulder":
                sprite = new Boulder({
                    sceneRenderer: this.sceneRenderer,
                    assetsManager: this.assetsManager,
                    launchPos: newSpriteInfo.launchPos,
                    targetPos: new THREE.Vector3(
                        newSpriteInfo.targetPosition.x,
                        newSpriteInfo.targetPosition.y,
                        newSpriteInfo.targetPosition.z
                    ),
                });
                break;

            case "Missile Barrage":
                sprite = new MissileBarrage({
                    sceneRenderer: this.sceneRenderer,
                    assetsManager: this.assetsManager,
                    launchPos: newSpriteInfo.launchPos,
                    targetPos: new THREE.Vector3(
                        newSpriteInfo.targetPosition.x,
                        newSpriteInfo.targetPosition.y,
                        newSpriteInfo.targetPosition.z
                    ),
                });
                break;

            case "Chaos Orb":
                sprite = new ChaosOrb({
                    sceneRenderer: this.sceneRenderer,
                    assetsManager: this.assetsManager,
                    launchPos: newSpriteInfo.launchPos,
                    targetPos: new THREE.Vector3(
                        newSpriteInfo.targetPosition.x,
                        newSpriteInfo.targetPosition.y,
                        newSpriteInfo.targetPosition.z
                    ),
                });
                break;

            case "Chaos Claw":
                sprite = new ChaosClaw({
                    sceneRenderer: this.sceneRenderer,
                    assetsManager: this.assetsManager,
                    launchPos: newSpriteInfo.launchPos,
                    targetPos: new THREE.Vector3(
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
                sceneRenderer: this.sceneRenderer,
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
