import * as THREE from "three";
import { Bot } from "../../Instances/Bot";
import { SPELLS_INFO } from "../../../../constants/spell";
import AssetsManager from "../../AssetsManager";
import { SceneRenderer } from "../../rendering/SceneRenderer";
import { BOT_PROPS } from "../../../../constants/bot";
import { cleanMaterial, disposeMesh } from "../../../../helper/three";
import { ANG2RAD } from "../../../../helper/math";
import { createAxeDamage } from "../../Particles/weapons/AxeDamage";

interface ThrowingAxeProps {
    sceneRenderer: SceneRenderer;
    assetsManager: AssetsManager;
    launchPos: THREE.Vector3;
    targetBot: Bot;
    bounceCount: number;
}

export class ThrowingAxe {
    sceneRenderer: SceneRenderer;
    assetsManager: AssetsManager;

    weaponType: string;
    attackDamage: number;
    damageType: any;
    targetBot: Bot;
    mesh: THREE.Object3D;

    lastTime: number;

    bounceCount: number;

    constructor({
        sceneRenderer,
        assetsManager,
        launchPos,
        targetBot,
        bounceCount = 0,
    }: ThrowingAxeProps) {
        this.sceneRenderer = sceneRenderer;
        this.assetsManager = assetsManager;

        this.weaponType = "Throwing Axes";
        this.attackDamage = SPELLS_INFO["Throwing Axes"].attackDamage;
        this.damageType = SPELLS_INFO["Throwing Axes"].damageType;
        this.targetBot = targetBot;
        this.bounceCount = bounceCount;

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
        const axeMesh = this.assetsManager._models.throwingAxe.scene.clone();
        axeMesh.position.y = -0.75;

        const group = new THREE.Group();
        group.rotateY(ANG2RAD(-90));
        group.add(axeMesh);

        this.mesh.add(group);
        this.mesh.scale.set(3, 3, 3);

        this.sceneRenderer.getScene().add(this.mesh);
    }

    addCollisionEffect() {
        const explosion = createAxeDamage(
            this.sceneRenderer._particleRenderer,
            this.assetsManager._particleTextures
        );

        explosion.position.x = this.mesh.position.x;
        explosion.position.y = this.mesh.position.y;
        explosion.position.z = this.mesh.position.z;

        explosion.scale.set(0.1, 0.1, 0.1);

        this.sceneRenderer.getScene().add(explosion);
    }

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

        const moveSpeed = 30;
        if (distance > 0) {
            const amount = Math.min(moveSpeed * deltaTime, distance) / distance;
            this.mesh.position.lerp(targetPosition, amount);
        }

        this.mesh.children[0].rotateZ(ANG2RAD(-10 * deltaTime * 100));
    }
}

export default ThrowingAxe;
