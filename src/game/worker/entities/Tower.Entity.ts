
import { Object3D, Vector3 } from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";

import { GAME_STATES } from "../../../constants";
import { TOWER_HEALTH_HEIGHT, TOWER_HEALTH_WIDTH } from "../../../constants/gameUI";
import { getColorForPercentage } from "../../../helper/color";
import { ParticleEffect } from "../gfx/managers/ParticleEffect";
import { TOWER_HEIGHT, TOWER_POSITIONS } from "../../../constants/tower";
import { PlayerStateComponent } from "../components/PlayerState.Component";
import { TimeComponent } from "../components/Time.Component";
import { BotManager } from "../managers/BotManager";
import { StateManager } from "../states/StateManager";
import { GameWorker } from "../GameWorker";
import { ResourcesManager } from "../managers/ResourcesManager";
import { GameEvents } from "../../Events";

//

export interface ITowerProperties {
    particleEffect:     ParticleEffect;
    playerIndex:        number;
    index:              number;
};

export interface ITowerStatus {
    level:      number;
    maxHp:      number;
    hp:         number;
    isDead:     boolean;
    gold:       number;
};

//

export class TowerEntity {

    public botManager: BotManager;

    public stateManager: StateManager;
    public particleEffect: ParticleEffect;
    public playerState: PlayerStateComponent;
    public time: TimeComponent;

    public level: number;
    public maxHp: number;
    public hp: number;
    public isDead: boolean;
    public towerMesh: any;
    public playerIndex: number;
    public index: number;
    public sacrificeHP: number;

    private healthBarPosition: Vector3 = new Vector3();

    //

    constructor ( params: ITowerProperties ) {

        this.botManager = new BotManager( params.index );
        this.playerState = new PlayerStateComponent();
        this.time = new TimeComponent({ tower: this });

        this.particleEffect = params.particleEffect;
        this.playerIndex = params.playerIndex;
        this.index = params.index;

        this.level = 1;
        this.hp = 1700;
        this.maxHp = 1700;
        this.isDead = false;

        this.sacrificeHP = 0;

        const towerModel = ResourcesManager.getModel("Buildings")?.scene.getObjectByName( 'orc_tower_Lv3_proto_orc_rts_0' ) as Object3D;
        this.towerMesh = SkeletonUtils.clone( towerModel );

        // construct UI part

        GameWorker.sendToMain( GameEvents.UI_ADD_ELEMENT, {
            id: `towerHealthBar_${ this.index }`,
            props: {
                className: "towerStatusBar",
                innerHTML: `
                    <div class="level">1</div>
                    <div class="healthBar">
                        <div class="healthBar__progress"></div>
                    </div>
                `
            }
        });

        this.initialize();

    };

    public initialize () : void {

        this.towerMesh.position.x = TOWER_POSITIONS[ this.index ].x;
        this.towerMesh.position.y = TOWER_POSITIONS[ this.index ].y;
        this.towerMesh.position.z = TOWER_POSITIONS[ this.index ].z;
        GameWorker.gameScene.add( this.towerMesh );

    };

    public levelUp () : void {

        GameWorker.sendToMain( GameEvents.UI_UPDATE_ELEMENT, {
            id: `towerHealthBar_${ this.index }`,
            class: 'gameLevel',
            props: {
                textContent: `Level ${ this.level }`
            }
        });

        // visual effect
        const newVector = new Vector3(
            this.towerMesh.position.x,
            this.towerMesh.position.y + 5,
            this.towerMesh.position.z
        );

        this.particleEffect.addLevelUp( newVector );

    };

    public setStatus ( status: ITowerStatus ) : void {

        this.level = status.level;
        this.maxHp = status.maxHp;
        this.hp = status.hp;
        this.isDead = status.isDead;

        this.playerState.gold = status.gold;

        this.updateHealth();

    };

    public renderHealthBar () : void {

        this.healthBarPosition.set( this.towerMesh.position.x, this.towerMesh.position.y + TOWER_HEIGHT, this.towerMesh.position.z );

        GameWorker.sendToMain( GameEvents.UI_SET_ELEMENT_POSITION, {
            id: `towerHealthBar_${ this.index }`,
            position: {
                x: this.healthBarPosition.x,
                y: this.healthBarPosition.y,
                z: this.healthBarPosition.z
            }
        });

        const scaleFactor = 85;
        const scaleVector = new Vector3();
        const scale = Math.sqrt( scaleVector.subVectors( this.healthBarPosition, GameWorker.gameScene.camera.position ).length() / scaleFactor );

        GameWorker.sendToMain( GameEvents.UI_UPDATE_ELEMENT, {
            id: `towerHealthBar_${ this.index }`,
            styles: {
                display: 'flex'
            }
        });

        GameWorker.sendToMain( GameEvents.UI_UPDATE_ELEMENT, {
            id: `towerHealthBar_${ this.index }`,
            class: 'towerStatusBar',
            styles: {
                gap: `${ 2 / scale }px`,
                padding: `${ 2 / scale }px`,
                transform: `scale( ${ 1 / scale } )`
            }
        });

        GameWorker.sendToMain( GameEvents.UI_UPDATE_ELEMENT, {
            id: `towerHealthBar_${ this.index }`,
            class: 'level',
            props: {
                textContent: this.level.toString()
            },
            styles: {
                fontSize: `${13 / scale}px`,
                borderWidth: `${1 / scale}px`,
                padding: `0 ${5 / scale}px`,
                height: `${13 / scale}px`
            }
        });

        GameWorker.sendToMain( GameEvents.UI_UPDATE_ELEMENT, {
            id: `towerHealthBar_${ this.index }`,
            class: 'healthBar',
            styles: {
                width: `${(TOWER_HEALTH_WIDTH + 2) / scale}px`,
                height: `${(TOWER_HEALTH_HEIGHT + 2) / scale}px`
            }
        });

        GameWorker.sendToMain( GameEvents.UI_UPDATE_ELEMENT, {
            id: `towerHealthBar_${ this.index }`,
            class: 'healthBar__progress',
            styles: {
                width: `${(TOWER_HEALTH_WIDTH * this.hp) / this.maxHp / scale}px`,
                height: `${TOWER_HEALTH_HEIGHT / scale}px`,
                left: `${1 / scale}px`,
                top: `${1 / scale}px`,
                background: getColorForPercentage( this.hp / this.maxHp )
            }
        });

        if ( this.index === GameWorker.playerIndex ) {

            GameWorker.sendToMain( GameEvents.UI_UPDATE_ELEMENT, {
                id: `towerHealthBar_${ this.index }`,
                class: 'currentHP',
                props: {
                    textContent: this.playerState.gold.toString()
                }
            });

            GameWorker.sendToMain( GameEvents.UI_UPDATE_ELEMENT, {
                id: `towerHealthBar_${ this.index }`,
                class: 'maxHP',
                props: {
                    textContent: ` / ${this.maxHp}`
                }
            });

            GameWorker.sendToMain( GameEvents.UI_UPDATE_ELEMENT, {
                id: `towerHealthBar_${ this.index }`,
                class: 'healthBar',
                styles: {
                    width: `${(this.hp / this.maxHp) * 100}%`
                }
            });

        }

    };

    public update () : void {

        if ( this.isDead ) return;

        this.time.tick();
        this.botManager.update();

        if ( this.hp <= 0 ) {

            this.isDead = true;

            if ( this.index === this.playerIndex ) {

                this.stateManager.setState( GAME_STATES.END );
                this.botManager.killAll();

            }

        }

        this.renderHealthBar();

    };

    //

    private updateHealth () : void {

        GameWorker.sendToMain( GameEvents.UI_UPDATE_ELEMENT, {
            id: `towerHealthBar_${ this.index }`,
            class: "healthBar__progress",
            props: {
                width: `${ ( TOWER_HEALTH_WIDTH * this.hp ) / this.maxHp }px`,
                backgroundColor: getColorForPercentage( this.hp / this.maxHp )
            }
        });

    };

};
