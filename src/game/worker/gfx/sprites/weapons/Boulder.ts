
import { Matrix4, Object3D, Quaternion, Vector3 } from "three";

import { SPELLS_INFO } from "../../../../../constants/spell";
import { disposeMesh } from "../../../../../helper/three";
import { ANG2RAD } from "../../../../../helper/math";
import { createRocketSmoke } from "../../particles/weapons/RocketSmoke";
import { createSmokeExplosion } from "../../particles/weapons/SmokeExplosion";
import { GameScene } from "../..";
import { ResourcesManager } from "../../../managers/ResourcesManager";

interface BoulderProps {
    gameScene: GameScene;
    launchPos: Vector3;
    targetPos: Vector3;
}

//

export class Boulder {

    gameScene: GameScene;

    weaponType: string;
    attackDamage: number;
    damageType: any;
    targetPos: Vector3;
    mesh: Object3D;

    lastTime: number;

    //

    constructor({ gameScene, launchPos, targetPos }: BoulderProps) {
        this.gameScene = gameScene;

        this.weaponType = "Boulder";
        this.attackDamage = SPELLS_INFO["Boulder"].attackDamage;
        this.damageType = SPELLS_INFO["Boulder"].damageType;
        this.targetPos = targetPos;

        this.mesh = new Object3D();
        this.mesh.position.set(launchPos.x, launchPos.y, launchPos.z);
        this.initMesh();

        this.lastTime = Date.now() * 0.001;
    }

    initMesh() {
        const model = ResourcesManager.getModel('Stone')?.scene.clone() as Object3D;
        model.scale.set(0.006, 0.006, 0.006);

        this.mesh.add(model);

        const particle = createRocketSmoke(
            this.gameScene.particleRenderer,
            [ ResourcesManager.getTexture("Particles1")!, ResourcesManager.getTexture("Particles2")! ]
        );

        particle.scale.set(0.3, 0.3, 0.3);

        this.gameScene.add(this.mesh);
    }

    addCollisionEffect() {
        const explosion = createSmokeExplosion(
            this.gameScene.particleRenderer,
            [ ResourcesManager.getTexture("Particles1")!, ResourcesManager.getTexture("Particles2")! ]
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

        const moveSpeed = 25;
        if (distance > 0) {
            const amount = Math.min(moveSpeed * deltaTime, distance) / distance;
            this.mesh.position.lerp(targetPosition, amount);
        }

        this.mesh.children[0].rotateX(ANG2RAD(5 * deltaTime * 100));
    }
}

export default Boulder;
