import * as THREE from "three";
import { Bot } from "../../Instances/Bot";
import { SPELLS_INFO } from "../../../../constants/spell";
import AssetsManager from "../../AssetsManager";
import { SceneRenderer } from "../../rendering/SceneRenderer";
import { BOT_PROPS } from "../../../../constants/bot";
import { disposeMesh } from "../../../../helper/three";
import { createChaosBeam } from "../../Particles/weapons/ChaosBeam";
import { createChaosExplosion } from "../../Particles/weapons/ChaosExplosion";
import { createChaosClaw } from "../../Particles/weapons/ChaosClaw";

interface Props {
    sceneRenderer: SceneRenderer;
    assetsManager: AssetsManager;
    launchPos: THREE.Vector3;
    targetBot: Bot;
}

export class ChaosClaw {
    sceneRenderer: SceneRenderer;
    assetsManager: AssetsManager;

    weaponType: string;
    attackDamage: number;
    damageType: any;
    targetBot: Bot;
    mesh: THREE.Object3D;

    bounceCount: number;

    lastTime: number;

    constructor({ sceneRenderer, assetsManager, launchPos, targetBot }: Props) {
        this.sceneRenderer = sceneRenderer;
        this.assetsManager = assetsManager;

        this.weaponType = "Chaos_Claw";
        this.attackDamage = SPELLS_INFO["Chaos_Claw"].attackDamage;
        this.damageType = SPELLS_INFO["Chaos_Claw"].damageType;
        this.targetBot = targetBot;

        this.bounceCount = SPELLS_INFO["Chaos_Claw"].BounceCount;

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
        const mesh = createChaosClaw(
            this.sceneRenderer._particleRenderer,
            this.assetsManager._particleTextures
        );

        mesh.position.x = 0;
        mesh.position.y = 0;
        mesh.position.z = 0;

        mesh.scale.set(0.15, 0.15, 0.15);

        this.mesh.add(mesh);

        this.sceneRenderer.getScene().add(this.mesh);
    }

    dispose() {
        disposeMesh(this.mesh);

        this.sceneRenderer.getScene().remove(this.mesh);
    }

    addCollisionEffect() {
        const particle = createChaosExplosion(
            this.sceneRenderer._particleRenderer,
            this.assetsManager._particleTextures
        );

        particle.position.x = this.mesh.position.x;
        particle.position.y = this.mesh.position.y;
        particle.position.z = this.mesh.position.z;

        particle.scale.set(0.1, 0.1, 0.1);

        this.sceneRenderer.getScene().add(particle);
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
    }
}

export default ChaosClaw;
