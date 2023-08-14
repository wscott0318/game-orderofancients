import * as THREE from "three";
import { Bot } from "../../Instances/Bot";
import { SPELLS_INFO } from "../../../../constants/spell";
import AssetsManager from "../../AssetsManager";
import { SceneRenderer } from "../../rendering/SceneRenderer";
import { BOT_PROPS } from "../../../../constants/bot";
import { disposeMesh } from "../../../../helper/three";
import { createFireBow } from "../../Particles/weapons/FireBow";
import { createBulletMuzzle } from "../../Particles/BulletMuzzle";

interface Props {
    sceneRenderer: SceneRenderer;
    assetsManager: AssetsManager;
    launchPos: THREE.Vector3;
    targetBot: Bot;
}

export class FireBow {
    sceneRenderer: SceneRenderer;
    assetsManager: AssetsManager;

    weaponType: string;
    attackDamage: number;
    damageType: any;
    targetBot: Bot;
    mesh: THREE.Object3D;

    lastTime: number;

    constructor({ sceneRenderer, assetsManager, launchPos, targetBot }: Props) {
        this.sceneRenderer = sceneRenderer;
        this.assetsManager = assetsManager;

        this.weaponType = "Fire_Bow";
        this.attackDamage = SPELLS_INFO["Fire_Bow"].attackDamage;
        this.damageType = SPELLS_INFO["Fire_Bow"].damageType;
        this.targetBot = targetBot;

        this.mesh = new THREE.Group();
        this.mesh.position.set(launchPos.x, launchPos.y, launchPos.z);
        this.initMesh();

        this.lastTime = Date.now() * 0.001;
    }

    initMesh() {
        const mesh = createFireBow(
            this.sceneRenderer._particleRenderer,
            this.assetsManager._particleTextures
        );

        mesh.position.x = 0;
        mesh.position.y = 0;
        mesh.position.z = 0;

        mesh.scale.set(0.2, 0.2, 0.2);

        this.mesh.add(mesh);

        this.sceneRenderer.getScene().add(this.mesh);
    }

    checkIfHit() {
        const distance = this.mesh.position.distanceTo(
            this.targetBot.mesh.position
        );

        return distance <= BOT_PROPS.modelHeight[this.targetBot.botType];
    }

    addCollisionEffect() {
        // const particle = createBulletMuzzle(
        //     this.sceneRenderer._particleRenderer,
        //     this.assetsManager._particleTextures
        // );

        // particle.position.x = this.mesh.position.x;
        // particle.position.y = this.mesh.position.y;
        // particle.position.z = this.mesh.position.z;

        // particle.scale.set(1.5, 1.5, 1.5);

        // this.sceneRenderer.getScene().add(particle);

        this.targetBot.fire(SPELLS_INFO['Fire_Bow'].duration);
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
    }
}

export default FireBow;
