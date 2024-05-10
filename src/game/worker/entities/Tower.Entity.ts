
import { Object3D, Vector2, Vector3 } from "three";
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
import { UIElement, UILayer, UIRect } from "../gfx/core/UILayer";

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
    private prevHp: number;
    public isDead: boolean;
    public towerMesh: any;
    public playerIndex: number;
    public id: number;
    public sacrificeHP: number;

    public healthBarWrapper: UIElement = null;
    public healthBar: UIElement = null;
    public levelBar: UIElement = null;
    public healthValueBar: UIElement = null;

    //

    constructor ( params: ITowerProperties ) {

        this.botManager = new BotManager( params.id );
        this.playerState = new PlayerStateComponent();
        this.time = new TimeComponent({ tower: this });

        this.playerIndex = params.playerIndex;
        this.id = params.id;

        this.level = 1;
        this.hp = 1700;
        this.prevHp = this.hp;
        this.maxHp = 1700;
        this.isDead = false;

        this.sacrificeHP = 0;

        const towerModel = ResourcesManager.getModel("Tower")?.scene;
        towerModel.traverse( ( child: Object3D ) => {

            if ( child instanceof Object3D ) {

                child.castShadow = true;
                child.receiveShadow = true;

            }

        });

        this.towerMesh = SkeletonUtils.clone( towerModel );

        // add UI health bar

        this.healthBarWrapper = new UIRect({
            name:           'TowerHealthBar',
            width:          160,
            height:         30,
            color:          "rgb(201, 160, 48)",
            innerShadow:    true
        });

        this.levelBar = new UIRect({
            name:           'TowerLevelBar',
            width:          35,
            height:         25,
            hAlign:         "left",
            color:          "#222",
            offset:         new Vector2( 3, 3 ),
            innerShadow:    true,
            text:           '1',
            fontSize:       20,
            textColor:      "#fff"
        });

        this.healthBar = new UIRect({
            name:           'TowerHealthBar',
            width:          118,
            height:         19,
            hAlign:         "left",
            offset:         new Vector2( 40, 3 ),
            color:          "#000000",
        });

        this.healthValueBar = new UIRect({
            name:           'TowerHealthBarProgress',
            width:          100,
            height:         15,
            hAlign:         "left",
            color:          "#ff0000",
            offset:         new Vector2( 2, 2 ),
            innerShadow:    true
        });

        UILayer.add( this.healthBarWrapper );
        this.healthBarWrapper.add( this.healthBar );
        this.healthBarWrapper.add( this.levelBar );
        this.healthBar.add( this.healthValueBar );

        //

        this.initialize();

    };

    public initialize () : void {

        this.towerMesh.position.x = TOWER_POSITIONS[ this.id ].x;
        this.towerMesh.position.y = TOWER_POSITIONS[ this.id ].y;
        this.towerMesh.position.z = TOWER_POSITIONS[ this.id ].z;
        GameWorker.arenaScene.add( this.towerMesh );

    };

    public levelUp () : void {

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

            GameWorker.sendToMain( GameEvents.SET_PLAYER_GOLD, this.playerState.gold );

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

        // update health bar

        if ( this.healthBarWrapper ) {

            this.healthBarWrapper.position.set( this.towerMesh.position.x, this.towerMesh.position.y + TOWER_HEIGHT, this.towerMesh.position.z );

            this.healthValueBar.width = ( this.healthBar.width - 4 ) * this.hp / this.maxHp;
            ( this.healthValueBar as UIRect ).color = getColorForPercentage( this.hp / this.maxHp );
            this.levelBar.text = this.level.toString();

        }

    };

    public dispose () : void {

        this.botManager.dispose();

    };

    //

    private updateHealth () : void {

        if ( this.id === this.playerIndex ) {

            GameWorker.sendToMain( GameEvents.SET_PLAYER_HEALTH, { hp: this.hp, maxHp: this.maxHp, level: this.level } );

        }

        if ( this.hp < this.prevHp ) {

            const deltaHP = this.prevHp - this.hp;
            this.prevHp = Math.max( 0, this.hp );

            if ( this.id === this.playerIndex ) {

                GameWorker.arenaScene.controls.addCameraShake( 0.02, deltaHP / this.maxHp, 0.2 );

            }

        }

    };

};
