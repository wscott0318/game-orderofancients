
import { Object3D, PerspectiveCamera, Scene, WebGLRenderTarget } from 'three';
import { BatchedRenderer } from 'three.quarks';

//

export abstract class GameScene {

    public scene: Scene = new Scene();
    public camera: PerspectiveCamera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    public particleRenderer: BatchedRenderer;

    protected _renderTarget: WebGLRenderTarget;

    //

    public abstract init () : void;
    public abstract update ( delta: number, time: number ) : void;
    public abstract resize () : void;
    public abstract getRenderTarget () : WebGLRenderTarget;
    public abstract dispose () : void;

    public add ( object: Object3D ) : void {

        this.scene.add( object );

    };

    public remove ( object: Object3D ) : void {

        this.scene.remove( object );

    };

};
