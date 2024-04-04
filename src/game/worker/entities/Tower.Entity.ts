
import { Object3D, Vector3 } from "three";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";

import { TOWER_HEALTH_HEIGHT, TOWER_HEALTH_WIDTH } from "../../../constants/gameUI";
import { getColorForPercentage } from "../../../helper/color";
import { TOWER_HEIGHT, TOWER_POSITIONS } from "../../../constants/tower";
import { PlayerStateComponent } from "../components/PlayerState.Component";
import { TimeComponent } from "../components/Time.Component";
import { BotManager } from "../managers/BotManager";
import { GameWorker } from "../GameWorker";
import { ResourcesManager } from "../managers/ResourcesManager";
import { GameEvents } from "../../Events";

//

export interface ITowerProperties {
    id:             number;
    playerIndex:    number;
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

    public playerState: PlayerStateComponent;
    public time: TimeComponent;

    public level: number;
    public maxHp: number;
    public hp: number;
    public isDead: boolean;
    public towerMesh: any;
    public playerIndex: number;
    public id: number;
    public sacrificeHP: number;

    private healthBarPosition: Vector3 = new Vector3();

    //

    constructor ( params: ITowerProperties ) {

        this.botManager = new BotManager( params.id );
        this.playerState = new PlayerStateComponent();
        this.time = new TimeComponent({ tower: this });

        this.playerIndex = params.playerIndex;
        this.id = params.id;

        this.level = 1;
        this.hp = 1700;
        this.maxHp = 1700;
        this.isDead = false;

        this.sacrificeHP = 0;

        const towerModel = ResourcesManager.getModel("Tower")?.scene;
        this.towerMesh = SkeletonUtils.clone( towerModel );

        // construct UI part

        GameWorker.sendToMain( GameEvents.UI_ADD_ELEMENT, {
            id: `towerHealthBar_${ this.id }`,
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

        this.towerMesh.position.x = TOWER_POSITIONS[ this.id ].x;
        this.towerMesh.position.y = TOWER_POSITIONS[ this.id ].y;
        this.towerMesh.position.z = TOWER_POSITIONS[ this.id ].z;
        GameWorker.arenaScene.add( this.towerMesh );

    };

    public levelUp () : void {

        GameWorker.sendToMain( GameEvents.UI_UPDATE_ELEMENT, {
            id: `towerHealthBar_${ this.id }`,
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

        GameWorker.arenaScene.particleEffect.addLevelUp( newVector );

    };

    public updateGold () : void {

        if ( this.id === this.playerIndex ) {

            GameWorker.sendToMain( "updateGold", this.playerState.gold );

        }

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
            id: `towerHealthBar_${ this.id }`,
            position: {
                x: this.healthBarPosition.x,
                y: this.healthBarPosition.y,
                z: this.healthBarPosition.z
            }
        });

        const scaleFactor = 85;
        const scaleVector = new Vector3();
        const scale = Math.sqrt( scaleVector.subVectors( this.healthBarPosition, GameWorker.arenaScene.camera.position ).length() / scaleFactor );

        GameWorker.sendToMain( GameEvents.UI_UPDATE_ELEMENT, {
            id: `towerHealthBar_${ this.id }`,
            class: 'towerStatusBar',
            styles: {
                gap: `${ 2 / scale }px`,
                padding: `${ 2 / scale }px`,
                transform: `scale( ${ 1 / scale } )`
            }
        });

        GameWorker.sendToMain( GameEvents.UI_UPDATE_ELEMENT, {
            id: `towerHealthBar_${ this.id }`,
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
            id: `towerHealthBar_${ this.id }`,
            class: 'healthBar',
            styles: {
                width: `${(TOWER_HEALTH_WIDTH + 2) / scale}px`,
                height: `${(TOWER_HEALTH_HEIGHT + 2) / scale}px`
            }
        });

        GameWorker.sendToMain( GameEvents.UI_UPDATE_ELEMENT, {
            id: `towerHealthBar_${ this.id }`,
            class: 'healthBar__progress',
            styles: {
                width: `${(TOWER_HEALTH_WIDTH * this.hp) / this.maxHp / scale}px`,
                height: `${TOWER_HEALTH_HEIGHT / scale}px`,
                left: `${1 / scale}px`,
                top: `${1 / scale}px`,
                background: getColorForPercentage( this.hp / this.maxHp )
            }
        });

    };

    public update () : void {

        if ( this.isDead ) return;

        this.time.tick();
        this.botManager.update();

        if ( this.hp <= 0 ) {

            this.isDead = true;

            if ( this.id === this.playerIndex ) {

                this.botManager.killAll();
                GameWorker.gameOver();

            }

        }

        this.renderHealthBar();

    };

    public dispose () : void {

        this.botManager.dispose();

    };

    //

    private updateHealth () : void {

        if ( this.id === this.playerIndex ) {

            GameWorker.sendToMain( GameEvents.SET_PLAYER_HEALTH, { hp: this.hp, maxHp: this.maxHp, level: this.level } );

        }

        //

        GameWorker.sendToMain( GameEvents.UI_UPDATE_ELEMENT, {
            id: `towerHealthBar_${ this.id }`,
            class: "healthBar__progress",
            props: {
                width: `${ ( TOWER_HEALTH_WIDTH * this.hp ) / this.maxHp }px`,
                backgroundColor: getColorForPercentage( this.hp / this.maxHp )
            }
        });

    };

};
