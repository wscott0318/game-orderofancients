
import { Color, Matrix4, Object3D, Quaternion, Vector3 } from "three";
// import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";
import TWEEN from "@tweenjs/tween.js";

import { BotAnimationController } from "../gfx/managers/BotAnimationController";
import { HEALTH_PIXEL } from "../../../constants/gameUI";
import { getColorForPercentage } from "../../../helper/color";
import { disposeMesh } from "../../../helper/three";
import { generateUUID } from "three/src/math/MathUtils";
import { ANIMATION_TYPE, BOT_PROPS, BOT_STATUS } from "../../../constants/bot";
import { TOWER_POSITIONS, TOWER_RADIUS } from "../../../constants/tower";
import { createStun } from "../gfx/particles/weapons/Stun";
import { createToonProjectile } from "../gfx/particles/ToonProjectile";
import { ResourcesManager } from "../managers/ResourcesManager";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { GameWorker } from "../GameWorker";

//

export class BotEntity {

    public uuid: string;
    public towerIndex: number;

    public hp: number;
    public maxHp: number;
    public speed: number;
    public position: any;
    public attackRange: number;
    public attackSpeed: number;
    public attackDamage: number;

    public botType: number;
    public targetPos: Vector3;

    public canRemove: boolean;
    public status: number;
    public oldStatus: number;

    public claimTime: number;
    public stunTime: number;
    public slowTime: number;
    public fireTime: number;

    public mesh: Object3D;
    public model: GLTF;
    // public healthBarUI: CSS2DObject;
    public stunMesh: Object3D | null;
    public fireMesh: Object3D | null;
    public animController: BotAnimationController;

    //

    constructor ( botType: number, towerIndex: number ) {

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

        //

        this.model = ResourcesManager.getModel( [ 'BotGrunt', 'BotSwordsman', 'BotArcher', 'BotKing', 'BotMage' ][ botType - 1 ] )!;
        this.mesh = SkeletonUtils.clone( this.model.scene );
        this.animController = new BotAnimationController({
            animations: this.model.animations,
            mesh: this.mesh,
            botType: this.botType,
        });
        this.targetPos = new Vector3(
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

        // const healthBarDiv = document.createElement("div");
        // healthBarDiv.className = "healthBar";

        // const healthProgressDiv = document.createElement("div");
        // healthProgressDiv.className = "healthBar__progress";

        // healthBarDiv.appendChild(healthProgressDiv);

        // this.healthBarUI = new CSS2DObject(healthBarDiv);

        this.initialize();

    };

    private initialize () : void {

        this.position.y = -1000;

        this.mesh.scale.x = 0.01;
        this.mesh.scale.y = 0.01;
        this.mesh.scale.z = 0.01;

        // GameWorker.gameScene.scene.add( this.healthBarUI );
        GameWorker.gameScene.scene.add( this.mesh );

    };

    private disposeHealthBar () : void {

        // this.healthBarUI.remove();
        // GameWorker.gameScene.scene.remove( this.healthBarUI );
        // this.healthBarUI.element.remove();

    };

    private disposeStunMesh () : void {

        if ( ! this.stunMesh ) return;

        disposeMesh( this.stunMesh );
        GameWorker.gameScene.scene.remove( this.stunMesh );

    };

    private disposeFireMesh () : void {

        if ( ! this.fireMesh ) return;

        disposeMesh( this.fireMesh );
        GameWorker.gameScene.scene.remove( this.fireMesh );

    };

    //

    public dispose () : void {

        this.animController.dispose();

        disposeMesh(this.mesh);
        GameWorker.gameScene.scene.remove(this.mesh);

        this.disposeStunMesh();

    };

    public kill () : void {

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
        });

    };

    public tick () : void {

        this.mesh.position.x = this.position.x;
        this.mesh.position.y = this.position.y;
        this.mesh.position.z = this.position.z;

        if ( this.stunTime > 0 ) {

            if ( ! this.stunMesh ) {

                this.stunMesh = new Object3D();

                const particle = createStun(
                    GameWorker.gameScene.particleRenderer,
                    [ ResourcesManager.getTexture("Particles1")!, ResourcesManager.getTexture("Particles2")! ]
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
                    GameWorker.gameScene.scene.add(this.stunMesh);

                });

            }

            this.animController.stopAnimation();

        } else if ( this.stunMesh ) {

            this.disposeStunMesh();
            this.stunMesh = null;

            if ( this.status === BOT_STATUS["walk"] ) {

                this.animController.playAnimation(ANIMATION_TYPE["walk"]);

            } else if ( this.status === BOT_STATUS["attack"] ) {

                this.animController.playAnimation(ANIMATION_TYPE["attack"]);

            }

        }

        if ( this.status === BOT_STATUS["dead"] ) {

            this.disposeStunMesh();

        }

        if ( this.slowTime > 0 ) {

            this.mesh.traverse((obj: any) => {

                if ( obj.isMesh || obj.isSkinnedMesh ) {

                    const material = obj.material.clone();

                    material.color = new Color(2, 10, 30);
                    obj.material = material;

                }

            });

        } else {

            this.slowTime = 0;

            this.mesh.traverse((obj: any) => {

                if ( obj.isMesh || obj.isSkinnedMesh ) {

                    const material = obj.material.clone();
                    material.color = new Color(1, 1, 1);
                    obj.material = material;

                }

            });

        }

        if ( this.fireTime > 0 ) {

            if ( ! this.fireMesh ) {

                const particle = createToonProjectile(
                    GameWorker.gameScene.particleRenderer,
                    [ ResourcesManager.getTexture("Particles1")!, ResourcesManager.getTexture("Particles2")! ]
                );

                const scaleOffset =
                    (BOT_PROPS["modelHeight"][this.botType] / 3) * 1.5;
                particle.scale.set(scaleOffset, scaleOffset, scaleOffset);

                this.fireMesh = particle;

                GameWorker.gameScene.scene.add(this.fireMesh);

            }

            if ( this.fireMesh ) {

                this.fireMesh.position.x = this.mesh.position.x;
                this.fireMesh.position.y = this.mesh.position.y + BOT_PROPS["modelHeight"][this.botType] / 2;
                this.fireMesh.position.z = this.mesh.position.z;

            }

        } else {

            this.fireTime = 0;
            this.disposeFireMesh();
            this.fireMesh = null;

        }

        const distance = this.mesh.position.distanceTo(this.targetPos);

        if ( this.status === BOT_STATUS["walk"] ) {

            if ( distance - this.attackRange <= TOWER_RADIUS ) {

                this.animController.playAnimation(ANIMATION_TYPE["attack"]);
                this.status = BOT_STATUS["attack"];

            }

        }

        /**
         * Rotate object to target position
         */

        const curPos = new Vector3(
            this.position.x,
            this.position.y,
            this.position.z
        );

        const rotationMatrix = new Matrix4();
        rotationMatrix.lookAt(this.targetPos, curPos, this.mesh.up);

        const targetQuaternion = new Quaternion();
        targetQuaternion.setFromRotationMatrix(rotationMatrix);
        this.mesh.quaternion.rotateTowards(targetQuaternion, 10);

        /**
         * Configure HealthBar UI
         */

        // this.healthBarUI.position.set(
        //     this.mesh.position.x,
        //     this.mesh.position.y + BOT_PROPS.modelHeight[this.botType],
        //     this.mesh.position.z
        // );

        // const scaleFactor = 85;
        // const scaleVector = new Vector3();
        // const scale = Math.sqrt( scaleVector.subVectors( this.healthBarUI.position, GameWorker.gameScene.camera.position ).length() / scaleFactor );

        // this.healthBarUI.element.style.width = `${ ( HEALTH_PIXEL * this.maxHp + 2 ) / scale }px`;
        // this.healthBarUI.element.style.height = `${ ( 5 + 2 ) / scale }px`;

        // const progressBar = this.healthBarUI.element.children[0] as HTMLDivElement;
        // progressBar.style.width = `${(HEALTH_PIXEL * this.hp) / scale}px`;
        // progressBar.style.height = `${5 / scale}px`;
        // progressBar.style.left = `${1 / scale}px`;
        // progressBar.style.top = `${1 / scale}px`;
        // progressBar.style.background = `${ getColorForPercentage( this.hp / this.maxHp ) }`;

        this.animController.tick();

    };

};
