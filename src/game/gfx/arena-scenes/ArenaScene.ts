
import { Color, GridHelper, MOUSE, PerspectiveCamera, Scene, TOUCH, WebGLRenderTarget } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { BatchedRenderer } from 'three.quarks';

import { Gfx } from './../core/Gfx';
import { GameScene } from '../core/GameScene';
import { TOWER_POSITIONS } from '../../../constants/tower';
import { ANG2RAD } from '../../../helper/math';
import { Game } from '../..';
import { EnvironmentManager } from './EnvironmentManager';
import { EventBridge } from '../../../libs/EventBridge';

//

export class ArenaScene extends GameScene {

    public scene: Scene;
    public camera: PerspectiveCamera;

    private _environment: EnvironmentManager;

    private gridHelper: GridHelper;

    private _camControls: OrbitControls;
    protected _renderTarget: WebGLRenderTarget;

    //

    public init () : void {

        this.scene = new Scene();
        this.camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

        this.particleRenderer = new BatchedRenderer();
        this.scene.add( this.particleRenderer );

        this.scene.background = new Color( 0xffffff );

        this._renderTarget = new WebGLRenderTarget( Gfx.width, Gfx.height );

        this._environment = new EnvironmentManager();
        this._environment.init( this.scene );

        EventBridge.onUIEvent( 'toggleGrid', this.toggleGrid );

        this.addGrid();
        this.initCameraControls();

    };

    public update ( delta: number, time: number ) : void {

        this._camControls.update();

        this.particleRenderer.update( delta / 1000 );

        Gfx.renderer.setRenderTarget( this._renderTarget );
        Gfx.renderer.render( this.scene, this.camera );

        Gfx.uiRenderer.render( this.scene, this.camera );

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

        this._camControls = new OrbitControls(
            this.camera,
            Gfx.renderer.domElement
        );

        this._camControls.screenSpacePanning = false;

        this._camControls.mouseButtons = {
            LEFT: MOUSE.PAN,
            MIDDLE: MOUSE.DOLLY,
            RIGHT: MOUSE.ROTATE,
        };

        this._camControls.touches = {
            ONE: TOUCH.PAN,
            TWO: TOUCH.DOLLY_ROTATE,
        };
        this._camControls.enableRotate = false;
        this._camControls.enableDamping = true;
        this._camControls.dampingFactor = 0.05;

        this._camControls.minPolarAngle = ANG2RAD(10);
        this._camControls.maxPolarAngle = ANG2RAD(65);
        this._camControls.maxDistance = 100;
        this._camControls.minDistance = 25;

        this._camControls.target.set(
            TOWER_POSITIONS[ Game.instance._playerIndex ].x,
            TOWER_POSITIONS[ Game.instance._playerIndex ].y,
            TOWER_POSITIONS[ Game.instance._playerIndex ].z
        );

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
