import * as THREE from "three";
import { Bot } from "../../Instances/Bot";
import { SPELLS_INFO } from "../../../../constants/spell";
import AssetsManager from "../../AssetsManager";
import { SceneRenderer } from "../../rendering/SceneRenderer";
import { BOT_PROPS } from "../../../../constants/bot";
import { cleanMaterial, disposeMesh } from "../../../../helper/three";
import { ANG2RAD } from "../../../../helper/math";
import { createToonProjectile } from "../../Particles/ToonProjectile";
import { createExplosion } from "../../Particles/Explosion2";

interface Props {
    sceneRenderer: SceneRenderer;
    assetsManager: AssetsManager;
    launchPos: THREE.Vector3;
    targetBot: Bot;
}

export class MissileBarrage {
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

        this.weaponType = "Missile Barrage";
        this.attackDamage = SPELLS_INFO["Missile_Barrage"].attackDamage;
        this.damageType = SPELLS_INFO["Missile_Barrage"].damageType;
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
        const mesh = this.assetsManager._models.missile.scene.clone();
        mesh.rotateX(ANG2RAD(90));
        mesh.scale.set(0.007, 0.007, 0.007);

        const particleMesh = createToonProjectile(
            this.sceneRenderer._particleRenderer,
            this.assetsManager._particleTextures
        );

        particleMesh.position.x = 0;
        particleMesh.position.y = 0;
        particleMesh.position.z = 0;

        this.mesh.add(mesh);
        this.mesh.add(particleMesh);

        this.sceneRenderer.getScene().add(this.mesh);
    }

    addCollisionEffect() {
        const particle = createExplosion(
            this.sceneRenderer._particleRenderer,
            this.assetsManager._particleTextures
        );

        particle.position.x = this.mesh.position.x;
        particle.position.y = this.mesh.position.y;
        particle.position.z = this.mesh.position.z;

        particle.scale.set(0.1, 0.1, 0.1);

        this.sceneRenderer.getScene().add(particle);
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

        const moveSpeed = 40;
        if (distance > 0) {
            const amount = Math.min(moveSpeed * deltaTime, distance) / distance;
            this.mesh.position.lerp(targetPosition, amount);
        }
    }
}

export default MissileBarrage;
