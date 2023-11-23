import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { BotAnimationController } from "../BotAnimationController";
import * as THREE from "three";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";
import { HEALTH_PIXEL } from "../../../constants/gameUI";
import { getColorForPercentage } from "../../../helper/color";
import { disposeMesh } from "../../../helper/three";
import TWEEN from "@tweenjs/tween.js";
import { generateUUID } from "three/src/math/MathUtils";
import { ANIMATION_TYPE, BOT_PROPS, BOT_STATUS } from "../../../constants/bot";
import { TOWER_POSITIONS, TOWER_RADIUS } from "../../../constants/tower";
import { createStun } from "../Particles/weapons/Stun";
import { SceneRenderer } from "../rendering/SceneRenderer";
import AssetsManager from "../AssetsManager";
import { createToonProjectile } from "../Particles/ToonProjectile";

export class Bot {
    uuid: string;
    hp: number;
    maxHp: number;
    speed: number;
    position: any;
    mesh: any;
    model: any;
    animController: BotAnimationController;
    botType: number;
    sceneRenderer: SceneRenderer;
    assetsManager: AssetsManager;
    scene: THREE.Scene;
    attackRange: number;
    targetPos: THREE.Vector3;
    status: number;
    oldStatus: number;
    healthBarUI: CSS2DObject;
    camera: THREE.PerspectiveCamera;
    attackSpeed: number;
    attackDamage: number;
    claimTime: number;
    canRemove: boolean;
    stunTime: number;
    stunMesh: THREE.Object3D | null;
    slowTime: number;
    fireMesh: THREE.Object3D | null;
    fireTime: number;
    towerIndex: number;

    constructor({ sceneRenderer, assetsManager, botType, towerIndex }: any) {
        this.towerIndex = towerIndex;

        this.sceneRenderer = sceneRenderer;
        this.assetsManager = assetsManager;
        this.uuid = generateUUID();
        this.hp = BOT_PROPS.healthPoint[botType];
        this.maxHp = BOT_PROPS.healthPoint[botType];
        this.attackSpeed = BOT_PROPS.attackSpeed[botType];
        this.attackDamage = BOT_PROPS.attackDamage[botType];
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
        this.targetPos = new THREE.Vector3(
            TOWER_POSITIONS[towerIndex].x,
            TOWER_POSITIONS[towerIndex].y,
            TOWER_POSITIONS[towerIndex].z
        );
        this.status = BOT_STATUS.walk;
        this.oldStatus = BOT_STATUS.walk;
        this.attackRange = BOT_PROPS.attackRange[botType];
        this.claimTime = 0;
        this.canRemove = false;
        this.stunTime = 0;
        this.stunMesh = null;
        this.slowTime = 0;

        this.fireMesh = null;
        this.fireTime = 0;

        const healthBarDiv = document.createElement("div");
        healthBarDiv.className = "healthBar";

        const healthProgressDiv = document.createElement("div");
        healthProgressDiv.className = "healthBar__progress";

        healthBarDiv.appendChild(healthProgressDiv);

        this.healthBarUI = new CSS2DObject(healthBarDiv);

        this.initialize();
    }

    initialize() {
        this.position.y = -1000;

        this.mesh.scale.x = 0.01;
        this.mesh.scale.y = 0.01;
        this.mesh.scale.z = 0.01;

        this.scene.add(this.healthBarUI);
        this.scene.add(this.mesh);
    }

    disposeHealthBar() {
        this.healthBarUI.remove();
        this.scene.remove(this.healthBarUI);
        this.healthBarUI.element.remove();
    }

    dispose() {
        this.animController.dispose();

        disposeMesh(this.mesh);
        this.scene.remove(this.mesh);

        this.disposeStunMesh();
    }

    disposeStunMesh() {
        if (this.stunMesh) {
            disposeMesh(this.stunMesh);
            this.scene.remove(this.stunMesh);
        }
    }

    disposeFireMesh() {
        if (this.fireMesh) {
            disposeMesh(this.fireMesh);
            this.scene.remove(this.fireMesh);
        }
    }

    kill() {
        this.animController.playAnimation(ANIMATION_TYPE["dead"]);

        this.status = BOT_STATUS["dead"];

        this.disposeHealthBar();
        this.disposeStunMesh();
        this.disposeFireMesh();

        const tweenAnimation = new TWEEN.Tween(this.mesh.position)
            .to(
                {
                    x: this.mesh.position.x,
                    y: this.mesh.position.y - 1,
                    z: this.mesh.position.z,
                },
                1000
            )
            .delay(3000)
            .start();

        tweenAnimation.onComplete(() => {
            this.dispose();

            this.canRemove = true;
        });
    }

    stun() {
        if (!this.stunMesh) {
            const particle = createStun(
                this.sceneRenderer._particleRenderer,
                this.assetsManager._particleTextures
            );

            particle.then((group) => {
                const particleMesh = group;

                particleMesh.position.set(
                    this.mesh.position.x,
                    this.mesh.position.y +
                        BOT_PROPS["modelHeight"][this.botType],
                    this.mesh.position.z
                );

                particleMesh.scale.set(0.7, 0.7, 0.7);

                this.stunMesh = particleMesh;
                this.scene.add(this.stunMesh);
            });
        }

        this.animController.stopAnimation();
    }

    slow() {
        this.mesh.traverse((obj: any) => {
            if (obj.isMesh || obj.isSkinnedMesh) {
                const material = obj.material.clone();

                material.color = new THREE.Color(2, 10, 30);
                obj.material = material;
            }
        });
    }

    fire() {
        if (!this.fireMesh) {
            const particle = createToonProjectile(
                this.sceneRenderer._particleRenderer,
                this.assetsManager._particleTextures
            );

            const scaleOffset =
                (BOT_PROPS["modelHeight"][this.botType] / 3) * 1.5;
            particle.scale.set(scaleOffset, scaleOffset, scaleOffset);

            this.fireMesh = particle;

            this.scene.add(this.fireMesh);
        }
    }

    tick() {
        this.mesh.position.x = this.position.x;
        this.mesh.position.y = this.position.y;
        this.mesh.position.z = this.position.z;

        if (this.status === BOT_STATUS["stun"]) {
            if (this.stunTime < 0) {
                this.disposeStunMesh();
                this.stunMesh = null;

                this.stunTime = 0;
                this.status = this.oldStatus;

                if (this.status === BOT_STATUS["walk"])
                    this.animController.playAnimation(ANIMATION_TYPE["walk"]);
                else if (this.status === BOT_STATUS["attack"])
                    this.animController.playAnimation(ANIMATION_TYPE["attack"]);
            }
        }

        if (this.status === BOT_STATUS["dead"]) {
            if (this.stunMesh) this.disposeStunMesh();
        }

        if (this.slowTime > 0) {
            if (this.slowTime <= 0) {
                this.slowTime = 0;

                this.mesh.traverse((obj: any) => {
                    if (obj.isMesh || obj.isSkinnedMesh) {
                        const material = obj.material.clone();
                        material.color = new THREE.Color(1, 1, 1);
                        obj.material = material;
                    }
                });
            }
        }

        if (this.fireTime > 0) {
            if (this.fireMesh) {
                this.fireMesh.position.x = this.mesh.position.x;
                this.fireMesh.position.y =
                    this.mesh.position.y +
                    BOT_PROPS["modelHeight"][this.botType] / 2;
                this.fireMesh.position.z = this.mesh.position.z;
            }

            if (this.fireTime <= 0) {
                this.fireTime = 0;
                this.disposeFireMesh();
                this.fireMesh = null;
            }
        }

        const distance = this.mesh.position.distanceTo(this.targetPos);

        if (this.status === BOT_STATUS["walk"]) {
            if (distance - this.attackRange <= TOWER_RADIUS) {
                this.animController.playAnimation(ANIMATION_TYPE["attack"]);
                this.status = BOT_STATUS["attack"];
            }
        }

        /**
         * Rotate object to target position
         */
        const curPos = new THREE.Vector3(
            this.position.x,
            this.position.y,
            this.position.z
        );

        const rotationMatrix = new THREE.Matrix4();
        rotationMatrix.lookAt(this.targetPos, curPos, this.mesh.up);

        const targetQuaternion = new THREE.Quaternion();
        targetQuaternion.setFromRotationMatrix(rotationMatrix);
        this.mesh.quaternion.rotateTowards(targetQuaternion, 10);

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
