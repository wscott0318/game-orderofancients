
import { Mesh, Vector3 } from "three";
import TWEEN from "@tweenjs/tween.js";
// @ts-ignore
import { Text } from "troika-three-text";

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

    public mesh: Mesh;

    //

    constructor ( { gameScene, text, color, position, fastMode = false }: TextSpriteProps ) {

        this.uuid = generateUUID();

        this.gameScene = gameScene;
        this.shouldRemove = false;
        this.position.set( position.x, position.y, position.z );

        // @ts-ignore
        this.mesh = new Text();
        this.mesh.position.set( position.x, position.y, position.z );
        // @ts-ignore
        this.mesh.text = text;
        // @ts-ignore
        this.mesh.color = color;
        // @ts-ignore
        this.mesh.fontSize = 1;
        gameScene.scene.add( this.mesh );

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

        tweenAnimation.onComplete(() => {
            this.dispose();
            this.shouldRemove = true;
        });

    }

    public dispose () : void {

        this.gameScene.scene.remove( this.mesh );

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

        this.mesh.scale.set( scale, scale, scale );
        this.mesh.position.set( this.position.x, this.position.y, this.position.z );
        this.mesh.quaternion.copy( this.gameScene.camera.quaternion );

    };

};
