
import { Vector3 } from "three";
import TWEEN from "@tweenjs/tween.js";

import { GameScene } from "..";
import { GameWorker } from "../../GameWorker";
import { GameEvents } from "../../../Events";
import { generateUUID } from "three/src/math/MathUtils";

//

interface TextSpriteProps {
    gameScene: GameScene;
    text: string;
    color: string;
    position: Vector3;
    fastMode: null | boolean;
}

export class TextSprite {

    public uuid: string;
    public shouldRemove: boolean;
    public gameScene: GameScene;
    public position: Vector3 = new Vector3();

    //

    constructor ( { gameScene, text, color, position, fastMode = false }: TextSpriteProps ) {

        this.uuid = generateUUID();

        this.gameScene = gameScene;
        this.shouldRemove = false;
        this.position.set( position.x, position.y, position.z );

        GameWorker.sendToMain( GameEvents.UI_ADD_ELEMENT, {
            id: `textSprite-${this.uuid}`,
            class: 'textSprite',
            props: {
                textContent: text
            },
            styles: {
                color: color
            }
        });

        GameWorker.sendToMain( GameEvents.UI_SET_ELEMENT_POSITION, {
            id: `textSprite-${this.uuid}`,
            position: {
                x: position.x,
                y: position.y,
                z: position.z
            }
        });

        const tweenAnimation = new TWEEN.Tween( this.position )
            .to(
                {
                    x: this.position.x,
                    y: this.position.y + ( fastMode ? 5 : 8 ),
                    z: this.position.z,
                },
                fastMode ? 300 : 3000
            )
            .easing(TWEEN.Easing.Linear.None)
            .start();

        tweenAnimation.onUpdate(() => {

            GameWorker.sendToMain( GameEvents.UI_SET_ELEMENT_POSITION, {
                id: `textSprite-${this.uuid}`,
                position: {
                    x: this.position.x,
                    y: this.position.y,
                    z: this.position.z
                }
            });

        });

        tweenAnimation.onComplete(() => {
            this.dispose();
            this.shouldRemove = true;
        });

    }

    public dispose () : void {

        GameWorker.sendToMain( GameEvents.UI_REMOVE_ELEMENT, {
            id: `textSprite-${this.uuid}`
        });

    };

    public tick () : void {

        const scaleFactor = 85;
        const scaleVector = new Vector3();

        const scale = Math.sqrt(
            scaleVector
                .subVectors(
                    this.position,
                    this.gameScene.camera.position
                )
                .length() / scaleFactor
        );

        GameWorker.sendToMain( GameEvents.UI_UPDATE_ELEMENT, {
            id: `textSprite-${this.uuid}`,
            styles: {
                fontSize: `${20 / scale}px`
            }
        });

    };

};
