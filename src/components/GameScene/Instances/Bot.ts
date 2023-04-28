import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
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
import { HEALTH_PIXEL } from "../../../constants/gameUI";
import { getColorForPercentage } from "../../../helper/color";

export class Bot {
    hp: number;
    maxHp: number;
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
    healthBarUI: CSS2DObject;
    camera: THREE.PerspectiveCamera;

    constructor({ sceneRenderer, assetsManager, botType }: any) {
        this.hp = BOT_PROPS.healthPoint[botType];
        this.maxHp = BOT_PROPS.healthPoint[botType];
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
        this.camera = sceneRenderer.getCamera();
        this.direction = new THREE.Vector3();
        this.targetPos = new THREE.Vector3(
            TOWER_POSITION.x,
            TOWER_POSITION.y,
            TOWER_POSITION.z
        );
        this.status = BOT_STATUS.walk;
        this.attackRange = BOT_PROPS.attackRange[botType];

        const healthBarDiv = document.createElement("div");
        healthBarDiv.className = "healthBar";

        const healthProgressDiv = document.createElement("div");
        healthProgressDiv.className = "healthBar__progress";

        healthBarDiv.appendChild(healthProgressDiv);

        this.healthBarUI = new CSS2DObject(healthBarDiv);

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

        this.scene.add(this.healthBarUI);
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

        /**
         * Configure HealthBar UI
         */

        this.healthBarUI.position.set(
            this.mesh.position.x,
            this.mesh.position.y + BOT_PROPS.modelHeight[this.botType],
            this.mesh.position.z
        );

        const scaleFactor = 85;
        const scaleVector = new THREE.Vector3();
        const scale = Math.sqrt(
            scaleVector
                .subVectors(this.healthBarUI.position, this.camera.position)
                .length() / scaleFactor
        );

        this.healthBarUI.element.style.width = `${
            (HEALTH_PIXEL * this.maxHp + 2) / scale
        }px`;
        this.healthBarUI.element.style.height = `${(5 + 2) / scale}px`;

        const progressBar = this.healthBarUI.element
            .children[0] as HTMLDivElement;
        progressBar.style.width = `${(HEALTH_PIXEL * this.hp) / scale}px`;
        progressBar.style.height = `${5 / scale}px`;
        progressBar.style.left = `${1 / scale}px`;
        progressBar.style.top = `${1 / scale}px`;
        progressBar.style.background = `${getColorForPercentage(
            this.hp / this.maxHp
        )}`;

        this.animController.tick();
    }
}
