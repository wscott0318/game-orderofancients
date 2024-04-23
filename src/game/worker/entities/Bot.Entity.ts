
import { Color, Matrix4, Object3D, Quaternion, Vector2, Vector3 } from "three";
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
import { UIElement, UILayer, UIRect } from "../gfx/core/UILayer";

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
    public stunMesh: Object3D | null;
    public fireMesh: Object3D | null;
    public animController: BotAnimationController;

    public healthBar: UIElement = null;
    public healthValueBar: UIElement = null;

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

        // add UI health bar

        this.healthBar = new UIRect({
            name:           'BotHealthBar',
            width:          60,
            height:         15,
            color:          "#000000",
        });

        this.healthValueBar = new UIRect({
            name:           'BotHealthBarProgress',
            width:          60,
            height:         11,
            hAlign:         "left",
            color:          "#ff0000",
            offset:         new Vector2( 2, 2 ),
            innerShadow:    true
        });
        this.healthBar.add( this.healthValueBar );

        UILayer.add( this.healthBar );

        //

        this.initialize();

    };

    private initialize () : void {

        this.position.y = -1000;

        this.mesh.scale.x = 0.01;
        this.mesh.scale.y = 0.01;
        this.mesh.scale.z = 0.01;

        GameWorker.arenaScene.add( this.mesh );

    };

    private disposeHealthBar () : void {

        UILayer.remove( this.healthBar );
        this.healthBar = null;

    };

    private disposeStunMesh () : void {

        if ( ! this.stunMesh ) return;

        disposeMesh( this.stunMesh );
        GameWorker.arenaScene.remove( this.stunMesh );

    };

    private disposeFireMesh () : void {

        if ( ! this.fireMesh ) return;

        disposeMesh( this.fireMesh );
        GameWorker.arenaScene.remove( this.fireMesh );

    };

    //

    public dispose () : void {

        this.animController.dispose();

        disposeMesh( this.mesh );
        GameWorker.arenaScene.remove( this.mesh );

        this.disposeStunMesh();

    };

    public kill () : void {

        this.animController.playAnimation( ANIMATION_TYPE["dead"] );

        this.status = BOT_STATUS["dead"];

        this.disposeHealthBar();
        this.disposeStunMesh();
        this.disposeFireMesh();

        const tweenAnimation = new TWEEN.Tween( this.mesh.position )
            .to(
                {
                    x: this.mesh.position.x,
                    y: this.mesh.position.y - 1,
                    z: this.mesh.position.z,
                },
                1000
            )
            .delay( 3000 )
            .start();

        tweenAnimation.onComplete( () => {

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
                    GameWorker.arenaScene.particleRenderer,
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
                    GameWorker.arenaScene.add(this.stunMesh);

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
                    GameWorker.arenaScene.particleRenderer,
                    [ ResourcesManager.getTexture("Particles1")!, ResourcesManager.getTexture("Particles2")! ]
                );

                const scaleOffset =
                    (BOT_PROPS["modelHeight"][this.botType] / 3) * 1.5;
                particle.scale.set(scaleOffset, scaleOffset, scaleOffset);

                this.fireMesh = particle;

                GameWorker.arenaScene.add(this.fireMesh);

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

        if ( this.healthBar ) {

            this.healthBar.position.set( this.mesh.position.x, this.mesh.position.y + BOT_PROPS.modelHeight[ this.botType ], this.mesh.position.z );

            this.healthValueBar.width = ( this.healthBar.width - 4 ) * this.hp / this.maxHp;
            ( this.healthValueBar as UIRect ).color = getColorForPercentage( this.hp / this.maxHp );

        }

        this.animController.tick();

    };

};
