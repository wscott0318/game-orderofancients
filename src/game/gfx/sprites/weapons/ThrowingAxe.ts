
import { Matrix4, Object3D, Quaternion, Vector3 } from "three";

import { SPELLS_INFO } from "../../../../constants/spell";
import { disposeMesh } from "../../../../helper/three";
import { ANG2RAD } from "../../../../helper/math";
import { createAxeDamage } from "../../particles/weapons/AxeDamage";
import { GameScene } from "../..";
import { ResourcesManager } from "../../../managers/ResourcesManager";

//

interface ThrowingAxeProps {
    gameScene: GameScene;
    launchPos: Vector3;
    targetPos: Vector3;
    bounceCount: number;
}

export class ThrowingAxe {

    public gameScene: GameScene;

    weaponType: string;
    attackDamage: number;
    damageType: any;
    targetPos: Vector3;
    mesh: Object3D;

    lastTime: number;

    bounceCount: number;

    //

    constructor({
        gameScene,
        launchPos,
        targetPos,
        bounceCount = 0,
    }: ThrowingAxeProps) {

        this.gameScene = gameScene;

        this.weaponType = "Throwing Axes";
        this.attackDamage = SPELLS_INFO["Throwing Axes"].attackDamage;
        this.damageType = SPELLS_INFO["Throwing Axes"].damageType;
        this.targetPos = targetPos;
        this.bounceCount = bounceCount;

        this.mesh = new Object3D();
        this.mesh.position.set(launchPos.x, launchPos.y, launchPos.z);
        this.initMesh();

        this.lastTime = Date.now() * 0.001;
    }

    checkIfHit() {}

    initMesh() {
        const axeMesh = ResourcesManager.getModel('ThrowingAxe')?.scene.clone() as Object3D;
        axeMesh.position.y = -0.75;

        const group = new Object3D();
        group.rotateY(ANG2RAD(-90));
        group.add(axeMesh);

        this.mesh.add(group);
        this.mesh.scale.set(3, 3, 3);

        this.gameScene.add(this.mesh);
    }

    addCollisionEffect() {
        const explosion = createAxeDamage(
            this.gameScene.particleRenderer,
            [ ResourcesManager.getTexture('Particles1')!, ResourcesManager.getTexture('Particles2')! ]
        );

        explosion.position.x = this.mesh.position.x;
        explosion.position.y = this.mesh.position.y;
        explosion.position.z = this.mesh.position.z;

        explosion.scale.set(0.1, 0.1, 0.1);

        this.gameScene.add(explosion);
    }

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

        const moveSpeed = 30;
        if (distance > 0) {
            const amount = Math.min(moveSpeed * deltaTime, distance) / distance;
            this.mesh.position.lerp(targetPosition, amount);
        }

        this.mesh.children[0].rotateZ(ANG2RAD(-10 * deltaTime * 100));
    }
}

export default ThrowingAxe;
