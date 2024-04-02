
import { PerspectiveCamera, Vector2, Vector3 } from "three";

import { GameWorker } from "../../GameWorker";
import { GameEvents } from "../../../Events";

//

export class ControlsManager {

    private camera: PerspectiveCamera;
    private offset: Vector3 = new Vector3( 0, 20, 10 );
    private altitude: number = 20;

    private maxAltitude: number = 50;
    private minAltitude: number = 10;

    private mouseKeys: { [key: number]: boolean } = {};
    private mousePos: Vector2 = new Vector2();

    //

    constructor ( camera: PerspectiveCamera ) {

        this.camera = camera;

        GameWorker.addListener( 'mousedown', this.mouseDownHandler );
        GameWorker.addListener( 'mouseup', this.mouseUpHandler );
        GameWorker.addListener( 'mousemove', this.mouseMoveHandler );
        GameWorker.addListener( 'mousewheel', this.mouseWheelHandler );

    };

    public dispose () : void {

        GameWorker.removeListener( 'mousedown', this.mouseDownHandler );
        GameWorker.removeListener( 'mouseup', this.mouseUpHandler );
        GameWorker.removeListener( 'mousemove', this.mouseMoveHandler );
        GameWorker.removeListener( 'mousewheel', this.mouseWheelHandler );

    };

    public update () : void {

        this.camera.position.y = 0.95 * this.camera.position.y + 0.05 * this.altitude;

        GameWorker.sendToMain( GameEvents.UI_SET_CAMERA_POSITION, {
            pos: {
                x: this.camera.position.x,
                y: this.camera.position.y,
                z: this.camera.position.z
            },
            target: {
                x: this.camera.position.x - this.offset.x,
                y: this.camera.position.y - this.offset.y,
                z: this.camera.position.z - this.offset.z,
            }
        });

    };

    //

    private mouseWheelHandler = ( event: { deltaY: number } ) : void => {

        this.altitude += event.deltaY / 100;
        this.altitude = Math.max( this.minAltitude, Math.min( this.maxAltitude, this.altitude ) );

    };

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

        // need to move to render loop later

        this.camera.position.x -= dx / 50;
        this.camera.position.z -= dy / 50;

        this.mousePos.set( event.x, event.y );

    };

};
