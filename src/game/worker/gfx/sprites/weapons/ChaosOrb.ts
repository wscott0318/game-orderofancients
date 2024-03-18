import { Matrix4, Object3D, Quaternion, Vector3 } from "three";

import { SPELLS_INFO } from "../../../../../constants/spell";
import { disposeMesh } from "../../../../../helper/three";
import { createChaosBeam } from "../../particles/weapons/ChaosBeam";
import { createChaosExplosion } from "../../particles/weapons/ChaosExplosion";
import { GameScene } from "../..";
import { ResourcesManager } from "../../../managers/ResourcesManager";

//

interface Props {
    gameScene: GameScene;
    launchPos: Vector3;
    targetPos: Vector3;
}

export class ChaosOrb {

    gameScene: GameScene;

    weaponType: string;
    attackDamage: number;
    damageType: any;
    targetPos: Vector3;
    mesh: Object3D;

    lastTime: number;

    constructor({ gameScene, launchPos, targetPos }: Props) {

        this.gameScene = gameScene;

        this.weaponType = "Chaos_Orb";
        this.attackDamage = SPELLS_INFO["Chaos_Orb"].attackDamage;
        this.damageType = SPELLS_INFO["Chaos_Orb"].damageType;
        this.targetPos = targetPos;

        this.mesh = new Object3D();
        this.mesh.position.set(launchPos.x, launchPos.y, launchPos.z);
        this.initMesh();

        this.lastTime = Date.now() * 0.001;
    }

    initMesh() {
        const mesh = createChaosBeam(
            this.gameScene.particleRenderer,
            [ ResourcesManager.getTexture("Particles1")!, ResourcesManager.getTexture("Particles2")! ]
        );

        mesh.position.x = 0;
        mesh.position.y = 0;
        mesh.position.z = 0;

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
            [ ResourcesManager.getTexture("Particles1")!, ResourcesManager.getTexture("Particles2")! ]
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

export default ChaosOrb;
