
import { Object3D, PerspectiveCamera, Scene, WebGLRenderTarget } from 'three';
import { BatchedRenderer } from 'three.quarks';

//

export abstract class GameScene {

    public scene: Scene;
    public camera: PerspectiveCamera;
    public particleRenderer: BatchedRenderer;

    protected renderTarget: WebGLRenderTarget;

    //

    public abstract init () : void;
    public abstract update ( delta: number, time: number ) : void;
    public abstract render ( delta: number, time: number ) : void;
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
