import * as THREE from "three";
import { Bot } from "../../Instances/Bot";
import { SPELLS_INFO } from "../../../../constants/spell";
import AssetsManager from "../../AssetsManager";
import { SceneRenderer } from "../../rendering/SceneRenderer";
import { BOT_PROPS } from "../../../../constants/bot";
import { cleanMaterial, disposeMesh } from "../../../../helper/three";
import { ANG2RAD } from "../../../../helper/math";

interface BowProps {
    sceneRenderer: SceneRenderer;
    assetsManager: AssetsManager;
    launchPos: THREE.Vector3;
    targetBot: Bot;
}

export class Bow {
    sceneRenderer: SceneRenderer;
    assetsManager: AssetsManager;

    weaponType: string;
    attackDamage: number;
    damageType: any;
    targetBot: Bot;
    mesh: THREE.Object3D;

    lastTime: number;

    constructor({
        sceneRenderer,
        assetsManager,
        launchPos,
        targetBot,
    }: BowProps) {
        this.sceneRenderer = sceneRenderer;
        this.assetsManager = assetsManager;

        this.weaponType = "Bow";
        this.attackDamage = SPELLS_INFO["Bow"].attackDamage;
        this.damageType = SPELLS_INFO["Bow"].damageType;
        this.targetBot = targetBot;

        this.mesh = new THREE.Group();
        this.mesh.position.set(launchPos.x, launchPos.y, launchPos.z);
        this.initMesh();

        this.lastTime = Date.now() * 0.001;
    }

    checkIfHit() {
        const distance = this.mesh.position.distanceTo(
            this.targetBot.mesh.position
        );

        return distance <= BOT_PROPS.modelHeight[this.targetBot.botType];
    }

    initMesh() {
        const bowMesh = this.assetsManager._models.arrow.scene.clone();
        bowMesh.rotateY(ANG2RAD(90));

        this.mesh.add(bowMesh);
        this.mesh.scale.set(0.015, 0.015, 0.015);

        this.sceneRenderer.getScene().add(this.mesh);
    }

    addCollisionEffect() {}

    dispose() {
        disposeMesh(this.mesh);

        this.sceneRenderer.getScene().remove(this.mesh);
    }

    tick() {
        const now = Date.now() * 0.001;
        const deltaTime = now - this.lastTime;
        this.lastTime = now;

        /**
         * Rotate object to target position
         */

        const targetPosition = new THREE.Vector3(
            this.targetBot.mesh.position.x,
            BOT_PROPS.modelHeight[this.targetBot.botType] - 1,
            this.targetBot.mesh.position.z
        );

        const rotationMatrix = new THREE.Matrix4();
        rotationMatrix.lookAt(targetPosition, this.mesh.position, this.mesh.up);

        const targetQuaternion = new THREE.Quaternion();
        targetQuaternion.setFromRotationMatrix(rotationMatrix);

        this.mesh.quaternion.rotateTowards(targetQuaternion, 10);

        const distance = this.mesh.position.distanceTo(targetPosition);

        const moveSpeed = 40;
        if (distance > 0) {
            const amount = Math.min(moveSpeed * deltaTime, distance) / distance;
            this.mesh.position.lerp(targetPosition, amount);
        }
    }
}

export default Bow;
