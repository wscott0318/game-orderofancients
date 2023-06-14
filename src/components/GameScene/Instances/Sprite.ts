import * as THREE from "three";
import { generateUUID } from "three/src/math/MathUtils";
import { BOT_PROPS } from "../../../constants/bot";

export class Sprite {
    object: any;
    targetObject: any;
    id: string;
    damage: number;
    lastTime: number;

    constructor({ object, targetObject, damage }: any) {
        this.id = generateUUID();
        this.object = object;
        this.targetObject = targetObject;
        this.damage = damage;
        this.lastTime = Date.now() * 0.001;
    }

    checkIfHit() {
        const distance = this.object.mesh.position.distanceTo(
            this.targetObject.mesh.position
        );

        return distance <= BOT_PROPS.modelHeight[this.targetObject.botType];
    }

    dispose() {
        this.object.dispose();
    }

    tick() {
        const now = Date.now() * 0.001;
        const deltaTime = now - this.lastTime;
        this.lastTime = now;

        /**
         * Rotate object to target position
         */

        const targetPosition = new THREE.Vector3(
            this.targetObject.mesh.position.x,
            BOT_PROPS.modelHeight[this.targetObject.botType] - 1,
            this.targetObject.mesh.position.z
        );

        const rotationMatrix = new THREE.Matrix4();
        rotationMatrix.lookAt(
            targetPosition,
            this.object.mesh.position,
            this.object.mesh.up
        );

        const targetQuaternion = new THREE.Quaternion();
        targetQuaternion.setFromRotationMatrix(rotationMatrix);

        this.object.mesh.quaternion.rotateTowards(targetQuaternion, 10);

        const distance = this.object.mesh.position.distanceTo(targetPosition);

        const moveSpeed = 15;
        if (distance > 0) {
            const amount = Math.min(moveSpeed * deltaTime, distance) / distance;
            this.object.mesh.position.lerp(targetPosition, amount);
        }

        this.object.tick();
    }
}
