import { Matrix4, Object3D, Quaternion, Vector3 } from "three";

import { SPELLS_INFO } from "../../../../../constants/spell";
import { ResourcesManager } from "../../../managers/ResourcesManager";
import { disposeMesh } from "../../../../../helper/three";
import { ANG2RAD } from "../../../../../helper/math";
import { GameScene } from "../..";

//

interface BowProps {
    gameScene: GameScene;
    launchPos: Vector3;
    targetPos: Vector3;
}

export class Bow {

    gameScene: GameScene;

    weaponType: string;
    attackDamage: number;
    damageType: any;
    targetPos: Vector3;
    mesh: Object3D;

    lastTime: number;

    constructor({ gameScene, launchPos, targetPos }: BowProps) {

        this.gameScene = gameScene;

        this.weaponType = "Bow";
        this.attackDamage = SPELLS_INFO["Bow"].attackDamage;
        this.damageType = SPELLS_INFO["Bow"].damageType;
        this.targetPos = targetPos;

        this.mesh = new Object3D();
        this.mesh.position.set(launchPos.x, launchPos.y, launchPos.z);
        this.initMesh();

        this.lastTime = Date.now() * 0.001;
    }

    initMesh() {
        const bowMesh = ResourcesManager.getModel('Arrow')?.scene.clone() as Object3D;
        bowMesh.rotateY(ANG2RAD(90));

        this.mesh.add(bowMesh);
        this.mesh.scale.set(0.015, 0.015, 0.015);

        this.gameScene.add(this.mesh);
    }

    addCollisionEffect() {}

    dispose() {
        disposeMesh(this.mesh);

        this.gameScene.remove(this.mesh);
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

        const moveSpeed = 40;
        if (distance > 0) {
            const amount = Math.min(moveSpeed * deltaTime, distance) / distance;
            this.mesh.position.lerp(targetPosition, amount);
        }
    }
}

export default Bow;
