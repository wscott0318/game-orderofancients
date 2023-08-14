import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import * as THREE from "three";
import TWEEN, { Tween } from "@tweenjs/tween.js";
import { SceneRenderer } from "../rendering/SceneRenderer";

interface TextSpriteProps {
    text: string;
    color: string;
    position: THREE.Vector3;
    sceneRenderer: SceneRenderer;
    fastMode: null | boolean;
}

export class TextSprite {
    textUI: CSS2DObject;
    sceneRenderer: SceneRenderer;
    shouldRemove: boolean;

    constructor({
        text,
        color,
        position,
        sceneRenderer,
        fastMode = false,
    }: TextSpriteProps) {
        this.sceneRenderer = sceneRenderer;
        this.shouldRemove = false;

        const textDiv = document.createElement("div");
        textDiv.className = "textSprite";
        textDiv.textContent = text;
        textDiv.style.color = color;

        this.textUI = new CSS2DObject(textDiv);
        this.textUI.position.set(position.x, position.y, position.z);

        this.sceneRenderer.getScene().add(this.textUI);

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
        this.sceneRenderer.getScene().remove(this.textUI);
        this.textUI.element.remove();
    }

    tick() {
        const scaleFactor = 85;
        const scaleVector = new THREE.Vector3();
        const scale = Math.sqrt(
            scaleVector
                .subVectors(
                    this.textUI.position,
                    this.sceneRenderer.getCamera().position
                )
                .length() / scaleFactor
        );

        this.textUI.element.style.fontSize = `${20 / scale}px`;
    }
}
