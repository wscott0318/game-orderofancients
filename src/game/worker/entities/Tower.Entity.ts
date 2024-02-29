
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

//

export interface ITowerProperties {
    stateManager:       StateManager;
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
    public healthBarUI: CSS2DObject;
    public playerIndex: number;
    public index: number;
    public sacrificeHP: number;

    //

    constructor ( params: ITowerProperties ) {

        this.botManager = new BotManager( params.index );
        this.playerState = new PlayerStateComponent();
        this.time = new TimeComponent({ tower: this });

        this.stateManager = params.stateManager;
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

        const wrapper = document.createElement("div");
        wrapper.className = "towerStatusBar";

        const levelDiv = document.createElement("div");
        levelDiv.className = "level";

        const healthBarDiv = document.createElement("div");
        healthBarDiv.className = "healthBar";

        const healthProgressDiv = document.createElement("div");
        healthProgressDiv.className = "healthBar__progress";

        healthBarDiv.appendChild( healthProgressDiv );

        wrapper.appendChild( levelDiv );
        wrapper.appendChild( healthBarDiv );

        this.healthBarUI = new CSS2DObject( wrapper );
        GameWorker.gameScene.add( this.healthBarUI );

        this.initialize();

    };

    public initialize () : void {

        this.towerMesh.position.x = TOWER_POSITIONS[ this.index ].x;
        this.towerMesh.position.y = TOWER_POSITIONS[ this.index ].y;
        this.towerMesh.position.z = TOWER_POSITIONS[ this.index ].z;
        GameWorker.gameScene.add( this.towerMesh );

    };

    public levelUp () : void {

        const element = document.getElementById( "gameLevel" );

        if ( element ) {

            element.textContent = `Level ${ this.level }`;

        }

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

        this.healthBarUI.position.set(
            this.towerMesh.position.x,
            this.towerMesh.position.y + TOWER_HEIGHT,
            this.towerMesh.position.z
        );

        const scaleFactor = 85;
        const scaleVector = new Vector3();
        const scale = Math.sqrt( scaleVector.subVectors( this.healthBarUI.position, GameWorker.gameScene.camera.position ).length() / scaleFactor );

        this.healthBarUI.element.classList.add("flex");
        this.healthBarUI.element.style.gap = `${2 / scale}px`;
        this.healthBarUI.element.style.padding = `${2 / scale}px`;

        const levelDiv = this.healthBarUI.element.getElementsByClassName( "level" )[0] as HTMLDivElement;
        levelDiv.textContent = String(this.level);
        levelDiv.style.fontSize = `${13 / scale}px`;
        levelDiv.style.borderWidth = `${1 / scale}px`;
        levelDiv.style.padding = `0 ${5 / scale}px`;
        levelDiv.style.height = `${13 / scale}px`;

        const healthBar = this.healthBarUI.element.getElementsByClassName( "healthBar" )[0] as HTMLDivElement;

        healthBar.style.width = `${(TOWER_HEALTH_WIDTH + 2) / scale}px`;
        healthBar.style.height = `${(TOWER_HEALTH_HEIGHT + 2) / scale}px`;

        const progressBar = healthBar.children[0] as HTMLDivElement;
        progressBar.style.width = `${
            (TOWER_HEALTH_WIDTH * this.hp) / this.maxHp / scale
        }px`;
        progressBar.style.height = `${TOWER_HEALTH_HEIGHT / scale}px`;
        progressBar.style.left = `${1 / scale}px`;
        progressBar.style.top = `${1 / scale}px`;

        progressBar.style.background = `${ getColorForPercentage( this.hp / this.maxHp ) }`;

        if ( this.index !== this.playerIndex ) return;

        const currentHealthDiv = document.getElementById("currentHP");

        if ( currentHealthDiv ) {

            currentHealthDiv.textContent = `${this.hp}`;

        }

        const maxHealthDiv = document.getElementById("maxHP");

        if ( maxHealthDiv ) {

            maxHealthDiv.textContent = ` / ${this.maxHp}`;

        }

        const healthBarDiv = document.getElementById("towerHealthBar");

        if ( healthBarDiv ) {

            healthBarDiv.style.width = `${(this.hp / this.maxHp) * 100}%`;

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

        const healthBarDiv = document.getElementsByClassName( "status_player_health" )[ this.index ] as HTMLDivElement;

        if ( healthBarDiv ) {

            healthBarDiv.style.width = `${ ( this.hp / this.maxHp ) * 100 }%`;
            healthBarDiv.style.backgroundColor = `${ getColorForPercentage( this.hp / this.maxHp ) }`;

        }

    };

};
