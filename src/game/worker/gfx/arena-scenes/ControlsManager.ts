
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

    private cameraShake: {
        frequency:                  number;
        amplitude:                  number;
        duration:                   number;
        _time:                      number;
        _lastOffsetUpdateTime:      number;
        _offset:                    Vector3;
        _offsetTarget:              Vector3;
    } = null;

    //

    constructor ( camera: PerspectiveCamera ) {

        this.camera = camera;

        GameWorker.addListener( GameEvents.CONTROLS_MOUSE_DOWN, this.mouseDownHandler );
        GameWorker.addListener( GameEvents.CONTROLS_MOUSE_UP, this.mouseUpHandler );
        GameWorker.addListener( GameEvents.CONTROLS_MOUSE_MOVE, this.mouseMoveHandler );
        GameWorker.addListener( GameEvents.CONTROLS_MOUSE_WHEEL, this.mouseWheelHandler );

    };

    public dispose () : void {

        GameWorker.removeListener( GameEvents.CONTROLS_MOUSE_DOWN, this.mouseDownHandler );
        GameWorker.removeListener( GameEvents.CONTROLS_MOUSE_UP, this.mouseUpHandler );
        GameWorker.removeListener( GameEvents.CONTROLS_MOUSE_MOVE, this.mouseMoveHandler );
        GameWorker.removeListener( GameEvents.CONTROLS_MOUSE_WHEEL, this.mouseWheelHandler );

    };

    public update ( delta: number ) : void {

        this.camera.position.y = 0.95 * this.camera.position.y + 0.05 * this.altitude;

        if ( this.cameraShake ) {

            if ( ! this.cameraShake._time || this.cameraShake._time - this.cameraShake._lastOffsetUpdateTime > this.cameraShake.frequency ) {

                this.cameraShake._offsetTarget.x = 3 * ( Math.random() - 0.5 ) * this.cameraShake.amplitude;
                this.cameraShake._offsetTarget.y = 3 * ( Math.random() - 0.5 ) * this.cameraShake.amplitude;
                this.cameraShake._offsetTarget.z = 3 * ( Math.random() - 0.5 ) * this.cameraShake.amplitude;

            }

            const dx = this.cameraShake._offsetTarget.x - this.cameraShake._offset.x;
            const dy = this.cameraShake._offsetTarget.y - this.cameraShake._offset.y;
            const dz = this.cameraShake._offsetTarget.z - this.cameraShake._offset.z;

            this.cameraShake._offset.x += dx * delta / this.cameraShake.frequency;
            this.cameraShake._offset.y += dy * delta / this.cameraShake.frequency;
            this.cameraShake._offset.z += dz * delta / this.cameraShake.frequency;

            this.camera.position.x += this.cameraShake._offset.x;
            this.camera.position.y += this.cameraShake._offset.y;
            this.camera.position.z += this.cameraShake._offset.z;

            this.cameraShake._time += delta;

            if ( this.cameraShake._time > this.cameraShake.duration ) {

                this.cameraShake = null;

            }

        }

    };

    public addCameraShake ( frequency: number, amplitude: number, duration: number ) : void {

        if ( this.cameraShake ) return;

        this.cameraShake = {
            frequency,
            amplitude,
            duration,
            _time: 0,
            _lastOffsetUpdateTime: 0,
            _offset: new Vector3(),
            _offsetTarget: new Vector3()
        };

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
