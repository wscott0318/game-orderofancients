import * as THREE from "three";
import { Bot } from "../../Instances/Bot";
import { SPELLS_INFO } from "../../../../constants/spell";
import AssetsManager from "../../AssetsManager";
import { SceneRenderer } from "../../rendering/SceneRenderer";
import { BOT_PROPS } from "../../../../constants/bot";
import { disposeMesh } from "../../../../helper/three";
import { ANG2RAD } from "../../../../helper/math";
import { createRocketSmoke } from "../../Particles/weapons/RocketSmoke";
import { createExplosion } from "../../Particles/Explosion2";
import { createSmokeExplosion } from "../../Particles/weapons/SmokeExplosion";

interface BoulderProps {
    sceneRenderer: SceneRenderer;
    assetsManager: AssetsManager;
    launchPos: THREE.Vector3;
    targetBot: Bot;
}

export class Boulder {
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
    }: BoulderProps) {
        this.sceneRenderer = sceneRenderer;
        this.assetsManager = assetsManager;

        this.weaponType = "Boulder";
        this.attackDamage = SPELLS_INFO["Boulder"].attackDamage;
        this.damageType = SPELLS_INFO["Boulder"].damageType;
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
        const model = this.assetsManager._models.stone.scene.clone();
        model.scale.set(0.006, 0.006, 0.006);

        this.mesh.add(model);

        const particle = createRocketSmoke(
            this.sceneRenderer._particleRenderer,
            this.assetsManager._particleTextures
        );

        particle.scale.set(0.3, 0.3, 0.3);

        // this.mesh.add(particle);

        this.sceneRenderer.getScene().add(this.mesh);
    }

    addCollisionEffect() {
        const explosion = createSmokeExplosion(
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

        const moveSpeed = 25;
        if (distance > 0) {
            const amount = Math.min(moveSpeed * deltaTime, distance) / distance;
            this.mesh.position.lerp(targetPosition, amount);
        }

        this.mesh.children[0].rotateX(ANG2RAD(5 * deltaTime * 100));
    }
}

export default Boulder;
