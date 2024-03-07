
import { PerspectiveCamera, Vector2, Vector3 } from "three";

import { GameWorker } from "../../GameWorker";

//

export class ControlsManager {

    private camera: PerspectiveCamera;
    private offset: Vector3 = new Vector3( 0, 0, 20 );

    private mouseKeys: { [key: number]: boolean } = {};
    private mousePos: Vector2 = new Vector2();

    //

    constructor ( camera: PerspectiveCamera ) {

        this.camera = camera;

        GameWorker.addListener( 'mousedown', this.mouseDownHandler );
        GameWorker.addListener( 'mouseup', this.mouseUpHandler );
        GameWorker.addListener( 'mousemove', this.mouseMoveHandler );

    };

    public dispose () : void {

        GameWorker.removeListener( 'mousedown', this.mouseDownHandler );
        GameWorker.removeListener( 'mouseup', this.mouseUpHandler );
        GameWorker.removeListener( 'mousemove', this.mouseMoveHandler );

    };

    //

    private mouseDownHandler = ( event: { key: number, x: number, y: number } ) : void => {

        this.mousePos.set( event.x, event.y );
        this.mouseKeys[ event.key ] = true;

    };

    private mouseUpHandler = ( event: { key: number, x: number, y: number } ) : void => {

        this.mousePos.set( event.x, event.y );
        this.mouseKeys[ event.key ] = false;

    };

    private mouseMoveHandler = ( event: { key: number, x: number, y: number } ) : void => {

        if ( ! this.mouseKeys[ 0 ] ) return;

        const dx = event.x - this.mousePos.x;
        const dy = event.y - this.mousePos.y;

        this.camera.position.x -= dx / 50;
        this.camera.position.z -= dy / 50;

        this.mousePos.set( event.x, event.y );

    };

};
