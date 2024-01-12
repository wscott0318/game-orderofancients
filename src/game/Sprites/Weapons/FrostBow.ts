import * as THREE from "three";
import { SPELLS_INFO } from "../../../constants/spell";
import { AssetsManager } from "../../managers/AssetsManager";
import { SceneRenderer } from "../../rendering/SceneRenderer";
import { disposeMesh } from "../../../helper/three";
import { createFrostBow } from "../../Particles/weapons/FrostBow";

interface Props {
    sceneRenderer: SceneRenderer;
    assetsManager: AssetsManager;
    launchPos: THREE.Vector3;
    targetPos: THREE.Vector3;
}

export class FrostBow {
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

        this.weaponType = "Frost_Bow";
        this.attackDamage = SPELLS_INFO["Frost_Bow"].attackDamage;
        this.damageType = SPELLS_INFO["Frost_Bow"].damageType;
        this.targetPos = targetPos;

        this.mesh = new THREE.Group();
        this.mesh.position.set(launchPos.x, launchPos.y, launchPos.z);
        this.initMesh();

        this.lastTime = Date.now() * 0.001;
    }

    initMesh() {
        const mesh = createFrostBow(
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

    addCollisionEffect() {}

    dispose() {
        disposeMesh(this.mesh);

        new THREE.Color(0, 0, 255);

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

        const moveSpeed = 30;
        if (distance > 0) {
            const amount = Math.min(moveSpeed * deltaTime, distance) / distance;
            this.mesh.position.lerp(targetPosition, amount);
        }
    }
}

export default FrostBow;
