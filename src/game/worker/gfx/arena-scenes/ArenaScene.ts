
import { Color, DepthTexture, GridHelper, PerspectiveCamera, Scene, UnsignedIntType, WebGLRenderTarget } from 'three';
import { BatchedRenderer } from 'three.quarks';

import { Gfx } from '../core/Gfx';
import { GameScene } from '../core/GameScene';
import { EnvironmentManager } from './EnvironmentManager';
import { GameWorker } from '../../GameWorker';
import { ControlsManager } from './ControlsManager';
import { GameEvents } from '../../../Events';
import { AnimationManager } from '../managers/AnimationManager';
import { SpriteManager } from '../managers/SpriteManager';
import { ParticleEffect } from '../managers/ParticleEffect';
import { TowerManager } from '../../managers/TowerManager';
import { TowerEntity } from '../../entities/Tower.Entity';
import { DecorationManager } from './DecorationsManager';
import { MinimapManager } from '../managers/MinimapManager';

//

interface IArenaState {
    players: {
        name:       string;
        income:     number;
        hp:         number;
        maxHp:      number;
        kills:      number;
        wins:       number;
        lastStand:  number;
    }[];
};

export class ArenaScene extends GameScene {

    public scene: Scene;
    public camera: PerspectiveCamera;

    private gridHelper: GridHelper;
    protected renderTarget: WebGLRenderTarget;

    public controls: ControlsManager;
    private environment: EnvironmentManager;
    public animationManager: AnimationManager;
    public decorationManager: DecorationManager;
    public spriteManager: SpriteManager;
    public particleEffect: ParticleEffect;
    public towerManager: TowerManager;
    public minimapManager: MinimapManager;

    //

    constructor () {

        super();

        GameWorker.addListener( GameEvents.GFX_TOGGLE_GRID, this.toggleGrid );

    };

    public init () : void {

        this.scene = new Scene();
        this.camera = new PerspectiveCamera( 75, Gfx.width / Gfx.height, 1, 200 );

        this.controls = new ControlsManager( this.camera );

        this.particleRenderer = new BatchedRenderer();
        this.scene.add( this.particleRenderer );

        this.scene.background = new Color( 0xffffff );

        this.renderTarget = new WebGLRenderTarget( Gfx.width, Gfx.height, { samples: 4 } );
        this.renderTarget.depthTexture = new DepthTexture( Gfx.width, Gfx.height, UnsignedIntType );

        //

        this.minimapManager = new MinimapManager();

        this.environment = new EnvironmentManager();
        this.environment.init( this.scene );

        this.decorationManager = new DecorationManager();
        this.decorationManager.init( this.scene );

        this.particleEffect = new ParticleEffect( this );
        this.spriteManager = new SpriteManager( this );
        this.animationManager = new AnimationManager( this );
        this.towerManager = new TowerManager();

        //

        for ( let i = 0; i < GameWorker.lobbyInfo.players.length; i ++ ) {

            const tower = new TowerEntity({
                playerIndex:        GameWorker.playerIndex,
                id:                 i
            });

            tower.playerState.name = GameWorker.lobbyInfo.players[ i ].name;
            this.towerManager.add( tower );

        }

        //

        this.minimapManager.init( Gfx.minimapCanvas );

        this.addGrid();
        this.initCameraControls();

    };

    public update ( delta: number, time: number ) : void {

        if ( GameWorker.tick % 60 === 0 ) {

            GameWorker.sendToMain( GameEvents.SET_ARENA_STATS, this.getStats() );

        }

        this.minimapManager.update();
        this.towerManager.update();
        this.spriteManager.tick();
        this.particleEffect.tick();

        this.controls.update( delta );

    };

    public render ( delta: number, time: number ) : void {

        this.particleRenderer.update( delta );

        Gfx.renderer.setRenderTarget( this.renderTarget );
        Gfx.renderer.setClearColor( 0xffffff );
        Gfx.renderer.clear();
        Gfx.renderer.render( this.scene, this.camera );

    };

    public resize ( dpr: number ) : void {

        const width = Gfx.width;
        const height = Gfx.height;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderTarget.setSize( width, height );

    };

    public getRenderTarget () : WebGLRenderTarget {

        return this.renderTarget;

    };

    public dispose () : void {

        this.scene.children = [];
        this.renderTarget.dispose();

        this.towerManager.dispose();
        this.particleEffect.dispose();
        this.animationManager.dispose();
        this.spriteManager.dispose();
        this.controls.dispose();

        this.controls = null;
        this.minimapManager = null;
        this.environment = null;
        this.decorationManager = null;
        this.particleEffect = null;
        this.spriteManager = null;
        this.animationManager = null;
        this.towerManager = null;

    };

    //

    private getStats () : IArenaState {

        const stats: IArenaState = {
            players: []
        };

        this.towerManager.towersArray.forEach( ( tower ) => {

            stats.players.push({
                name:           tower.playerState.name,
                income:         tower.playerState.income,
                hp:             tower.hp,
                maxHp:          tower.maxHp,
                kills:          tower.playerState.kills,
                wins:           tower.playerState.wins,
                lastStand:      tower.playerState.lastStand
            });

        });

        return stats;

    };

    private initCameraControls () : void {

        this.camera.position.set( 0, 20, 10 );
        this.camera.lookAt( 0, 0, 0 );

    };

    private addGrid () : void {

        const size = 500;
        const divisions = 500;

        const color = new Color(0x333333);

        this.gridHelper = new GridHelper(size, divisions, color, color);
        this.gridHelper.position.y = 0.01;
        this.gridHelper.visible = false;

        this.scene.add( this.gridHelper );

    };

    private toggleGrid = ( visible: boolean ) : void => {

        this.gridHelper.visible = visible;

    };

};
