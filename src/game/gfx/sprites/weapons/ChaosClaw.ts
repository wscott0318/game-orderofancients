
import { Matrix4, Object3D, Quaternion, Vector3 } from "three";

import { SPELLS_INFO } from "../../../../constants/spell";
import { AssetsManager } from "../../../managers/AssetsManager";
import { disposeMesh } from "../../../../helper/three";
import { createChaosExplosion } from "../../particles/weapons/ChaosExplosion";
import { createChaosClaw } from "../../particles/weapons/ChaosClaw";
import { GameScene } from "../..";

//

interface Props {
    gameScene: GameScene;
    assetsManager: AssetsManager;
    launchPos: THREE.Vector3;
    targetPos: THREE.Vector3;
}

export class ChaosClaw {

    gameScene: GameScene;
    assetsManager: AssetsManager;

    weaponType: string;
    attackDamage: number;
    damageType: any;
    targetPos: THREE.Vector3;
    mesh: THREE.Object3D;

    bounceCount: number;

    lastTime: number;

    //

    constructor({ gameScene, assetsManager, launchPos, targetPos }: Props) {

        this.gameScene = gameScene;
        this.assetsManager = assetsManager;

        this.weaponType = "Chaos_Claw";
        this.attackDamage = SPELLS_INFO["Chaos_Claw"].attackDamage;
        this.damageType = SPELLS_INFO["Chaos_Claw"].damageType;
        this.targetPos = targetPos;

        this.bounceCount = SPELLS_INFO["Chaos_Claw"].BounceCount;

        this.mesh = new Object3D();
        this.mesh.position.set(launchPos.x, launchPos.y, launchPos.z);
        this.initMesh();

        this.lastTime = Date.now() * 0.001;
    }

    initMesh() {
        const mesh = createChaosClaw(
            this.gameScene.particleRenderer,
            this.assetsManager._particleTextures
        );

        mesh.position.x = 0;
        mesh.position.y = 0;
        mesh.position.z = 0;

        mesh.scale.set(0.15, 0.15, 0.15);

        this.mesh.add(mesh);

        this.gameScene.add(this.mesh);
    }

    dispose() {
        disposeMesh(this.mesh);

        this.gameScene.remove(this.mesh);
    }

    addCollisionEffect() {
        const particle = createChaosExplosion(
            this.gameScene.particleRenderer,
            this.assetsManager._particleTextures
        );

        particle.position.x = this.mesh.position.x;
        particle.position.y = this.mesh.position.y;
        particle.position.z = this.mesh.position.z;

        particle.scale.set(0.1, 0.1, 0.1);

        this.gameScene.add(particle);
    }

    tick() {
        const now = Date.now() * 0.001;
        const deltaTime = now - this.lastTime;
        this.lastTime = now;

        /**
         * Rotate object to target position
         */

        const targetPosition = new Vector3(
            this.targetPos.x,
            this.targetPos.y,
            this.targetPos.z
        );

        const rotationMatrix = new Matrix4();
        rotationMatrix.lookAt(targetPosition, this.mesh.position, this.mesh.up);

        const targetQuaternion = new Quaternion();
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
