
import { Vector3 } from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import TWEEN from "@tweenjs/tween.js";

import { GameScene } from "..";
import { GameWorker } from "../../GameWorker";

//

interface TextSpriteProps {
    gameScene: GameScene;
    text: string;
    color: string;
    position: Vector3;
    fastMode: null | boolean;
}

export class TextSprite {

    public textUI: CSS2DObject;
    public shouldRemove: boolean;
    public gameScene: GameScene;

    //

    constructor({
        gameScene,
        text,
        color,
        position,
        fastMode = false,
    }: TextSpriteProps) {

        this.gameScene = gameScene;
        this.shouldRemove = false;

        const textDiv = document.createElement("div");
        textDiv.className = "textSprite";
        textDiv.textContent = text;
        textDiv.style.color = color;

        this.textUI = new CSS2DObject(textDiv);
        this.textUI.position.set(position.x, position.y, position.z);

        GameWorker.gameScene.add(this.textUI);

        const tweenAnimation = new TWEEN.Tween(this.textUI.position)
            .to(
                {
                    x: this.textUI.position.x,
                    y: this.textUI.position.y + (fastMode ? 5 : 15),
                    z: this.textUI.position.z,
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

    dispose() {
        this.textUI.remove();
        this.gameScene.remove(this.textUI);
        this.textUI.element.remove();
    }

    tick() {
        const scaleFactor = 85;
        const scaleVector = new Vector3();
        const scale = Math.sqrt(
            scaleVector
                .subVectors(
                    this.textUI.position,
                    this.gameScene.camera.position
                )
                .length() / scaleFactor
        );

        this.textUI.element.style.fontSize = `${20 / scale}px`;
    }
}
