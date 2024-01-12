import * as THREE from "three";
import { SPELLS_INFO } from "../../../constants/spell";
import { AssetsManager } from "../../managers/AssetsManager";
import { SceneRenderer } from "../../rendering/SceneRenderer";
import { disposeMesh } from "../../../helper/three";
import { createBulletMuzzle } from "../../Particles/BulletMuzzle";

interface Props {
    sceneRenderer: SceneRenderer;
    assetsManager: AssetsManager;
    launchPos: THREE.Vector3;
    targetPos: THREE.Vector3;
}

export class Rifle {
    sceneRenderer: SceneRenderer;
    assetsManager: AssetsManager;

    weaponType: string;
    attackDamage: number;
    damageType: any;
    targetPos: THREE.Vector3;
    mesh: THREE.Object3D;

    lastTime: number;

    constructor({ sceneRenderer, assetsManager, launchPos, targetPos }: Props) {
        this.sceneRenderer = sceneRenderer;
        this.assetsManager = assetsManager;

        this.weaponType = "Rifle";
        this.attackDamage = SPELLS_INFO["Rifle"].attackDamage;
        this.damageType = SPELLS_INFO["Rifle"].damageType;
        this.targetPos = targetPos;

        this.mesh = new THREE.Group();
        this.mesh.position.set(launchPos.x, launchPos.y, launchPos.z);
        this.initMesh();

        this.lastTime = Date.now() * 0.001;
    }

    initMesh() {}

    addCollisionEffect() {
        const particle = createBulletMuzzle(
            this.sceneRenderer._particleRenderer,
            this.assetsManager._particleTextures
        );

        particle.position.x = this.mesh.position.x;
        particle.position.y = this.mesh.position.y;
        particle.position.z = this.mesh.position.z;

        particle.scale.set(1.5, 1.5, 1.5);

        this.sceneRenderer.getScene().add(particle);

        // this.targetBot.stun(SPELLS_INFO["Rifle"].stunDuration);
    }

    dispose() {
        disposeMesh(this.mesh);

        setTimeout(() => {
            this.sceneRenderer.getScene().remove(this.mesh);
        }, 200);
    }

    tick() {
        const now = Date.now() * 0.001;
        const deltaTime = now - this.lastTime;
        this.lastTime = now;

        /**
         * Rotate object to target position
         */

        const targetPosition = new THREE.Vector3(
            this.targetPos.x,
            this.targetPos.y,
            this.targetPos.z
        );

        const rotationMatrix = new THREE.Matrix4();
        rotationMatrix.lookAt(targetPosition, this.mesh.position, this.mesh.up);

        const targetQuaternion = new THREE.Quaternion();
        targetQuaternion.setFromRotationMatrix(rotationMatrix);

        this.mesh.quaternion.rotateTowards(targetQuaternion, 10);

        const distance = this.mesh.position.distanceTo(targetPosition);

        const moveSpeed = 15;
        if (distance > 0) {
            const amount = Math.min(moveSpeed * deltaTime, distance) / distance;
            this.mesh.position.lerp(targetPosition, amount);
        }
    }
}

export default Rifle;
