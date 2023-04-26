import {
    ANIMATION_TYPE,
    BOT_PROPS,
    BOT_STATUS,
    FOREST_RADIUS,
    TOWER_POSITION,
    TOWER_RADIUS,
} from "../../../constants";
import { ANG2RAD } from "../../../helper/math";
import { BotAnimationController } from "../BotAnimationController";
import * as THREE from "three";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";

export class Bot {
    hp: number;
    speed: number;
    position: any;
    mesh: any;
    model: any;
    animController: BotAnimationController;
    botType: number;
    scene: THREE.Scene;
    attackRange: number;
    direction: THREE.Vector3;
    targetPos: THREE.Vector3;
    status: number;

    constructor({ sceneRenderer, assetsManager, botType }: any) {
        this.hp = 100;
        this.speed = 0.1;
        this.position = {
            x: 0,
            y: 0,
            z: 0,
        };
        this.botType = botType;
        this.model = assetsManager.getBotModel(botType);
        this.mesh = SkeletonUtils.clone(this.model.scene);
        this.animController = new BotAnimationController({
            animations: this.model.animations,
            mesh: this.mesh,
            botType: this.botType,
        });
        this.scene = sceneRenderer.getScene();
        this.direction = new THREE.Vector3();
        this.targetPos = new THREE.Vector3(
            TOWER_POSITION.x,
            TOWER_POSITION.y,
            TOWER_POSITION.z
        );
        this.status = BOT_STATUS.walk;
        this.attackRange = BOT_PROPS.attackRange[botType];

        this.initialize();
    }

    initialize() {
        const angle = THREE.MathUtils.randInt(0, 360);
        const distance = FOREST_RADIUS;

        this.position.x = -Math.cos(ANG2RAD(angle)) * distance;
        this.position.z = -Math.sin(ANG2RAD(angle)) * distance;

        this.mesh.scale.x = 0.01;
        this.mesh.scale.y = 0.01;
        this.mesh.scale.z = 0.01;

        this.mesh.position.x = this.position.x;
        this.mesh.position.y = this.position.y;
        this.mesh.position.z = this.position.z;

        this.scene.add(this.mesh);

        /**
         * Direction Vector
         */

        const curPos = new THREE.Vector3(
            this.position.x,
            this.position.y,
            this.position.z
        );

        this.direction.subVectors(this.targetPos, curPos).normalize();

        /**
         * Rotate object to target position
         */

        const rotationMatrix = new THREE.Matrix4();
        rotationMatrix.lookAt(this.targetPos, curPos, this.mesh.up);

        const targetQuaternion = new THREE.Quaternion();
        targetQuaternion.setFromRotationMatrix(rotationMatrix);

        this.mesh.quaternion.rotateTowards(targetQuaternion, 10);
    }

    tick() {
        const distance = this.mesh.position.distanceTo(this.targetPos);

        if (this.status === BOT_STATUS["walk"]) {
            if (distance - this.attackRange <= TOWER_RADIUS) {
                this.animController.playAnimation(ANIMATION_TYPE["attack"]);
                this.status = BOT_STATUS["attack"];
            }

            const target = new THREE.Vector3(
                this.mesh.position.x + this.direction.x * this.speed,
                0,
                this.mesh.position.z + this.direction.z * this.speed
            );

            this.mesh.position.lerp(target, 0.9);
        }

        this.animController.tick();
    }
}
