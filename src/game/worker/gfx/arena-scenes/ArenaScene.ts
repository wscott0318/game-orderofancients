
import { Color, GridHelper, PerspectiveCamera, Scene, WebGLRenderTarget } from 'three';
import { BatchedRenderer } from 'three.quarks';

import { Gfx } from '../core/Gfx';
import { GameScene } from '../core/GameScene';
import { EnvironmentManager } from './EnvironmentManager';
import { GameWorker } from '../../GameWorker';
import { ControlsManager } from './ControlsManager';
import { GameEvents } from '../../../Events';

//

export class ArenaScene extends GameScene {

    public scene: Scene;
    public camera: PerspectiveCamera;

    public controls: ControlsManager;

    private _environment: EnvironmentManager;

    private gridHelper: GridHelper;

    protected _renderTarget: WebGLRenderTarget;

    //

    public init () : void {

        this.scene = new Scene();
        this.camera = new PerspectiveCamera( 75, Gfx.width / Gfx.height, 0.1, 1000 );

        this.controls = new ControlsManager( this.camera );

        this.particleRenderer = new BatchedRenderer();
        this.scene.add( this.particleRenderer );

        this.scene.background = new Color( 0xffffff );

        this._renderTarget = new WebGLRenderTarget( Gfx.width, Gfx.height );

        this._environment = new EnvironmentManager();
        this._environment.init( this.scene );

        GameWorker.addListener( GameEvents.GFX_TOGGLE_GRID, this.toggleGrid );

        this.addGrid();
        this.initCameraControls();

    };

    public update ( delta: number, time: number ) : void {

        // this._camControls.update();

        this.particleRenderer.update( delta / 1000 );

        Gfx.renderer.setRenderTarget( this._renderTarget );
        Gfx.renderer.setClearColor( 0xffffff );
        Gfx.renderer.clear();
        Gfx.renderer.render( this.scene, this.camera );

    };

    public resize () : void {

        const width = Gfx.width;
        const height = Gfx.height;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this._renderTarget.setSize( width, height );

    };

    public getRenderTarget () : WebGLRenderTarget {

        return this._renderTarget;

    };

    public dispose () : void {

        this.scene.children = [];
        this._renderTarget.dispose();

    };

    //

    private initCameraControls () : void {

        this.camera.position.set( 0, 20, 10 );
        this.camera.lookAt( 0, 0, 0 );

        GameWorker.sendToMain( GameEvents.UI_SET_CAMERA_POSITION, {
            pos: {
                x: this.camera.position.x,
                y: this.camera.position.y,
                z: this.camera.position.z
            },
            target: {
                x: 0,
                y: 0,
                z: 0
            }
        });

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
