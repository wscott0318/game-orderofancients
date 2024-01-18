
import { gsap, Circ } from "gsap";
import { Vector2, Vector3 } from "three";

import { CAMERA_POS } from "../../constants";
import { TOWER_POSITIONS } from "../../constants/tower";
import { GameScene } from "../gfx";

interface AnimationManagerProps {
    gameScene: GameScene;
    playerIndex: number;
}

//

export class AnimationManager {

    public gameScene: GameScene;
    public _towerPosition: THREE.Vector3;
    public _camera: THREE.Camera;
    public _spotLight: THREE.SpotLight;
    public _hemiLight: THREE.HemisphereLight;
    public _playerIndex: number;

    //

    constructor ( params: AnimationManagerProps ) {

        this.gameScene = params.gameScene;
        this._playerIndex = params.playerIndex;

        this._towerPosition = new Vector3(
            TOWER_POSITIONS[this._playerIndex].x,
            TOWER_POSITIONS[this._playerIndex].y,
            TOWER_POSITIONS[this._playerIndex].z
        );

        // this._spotLight = this._sceneRenderer._spotLightArray[ params.playerIndex ];
        // this._hemiLight = this._sceneRenderer._hemiLight;

    }

    public camera_Down () : void {

        gsap.to(this._camera.position, {
            ...CAMERA_POS.sideView,
            duration: 3,
            ease: Circ.easeIn,
            onUpdate: () => {
                this._camera.lookAt(this._towerPosition);
            },
        });

    }

    public camera_Rotate () : void {

        const camera2DPos = new Vector2(
            this._camera.position.x,
            this._camera.position.y
        );

        const tower2DPos = new Vector2(
            this._towerPosition.x,
            this._towerPosition.y
        );

        const rotPos = {
            radius: camera2DPos.distanceTo(tower2DPos),
            angle: 0,
        };

        gsap.to(rotPos, {
            angle: -Math.PI * 2,
            duration: 10,
            repeat: -1,
            ease: "none",
            onUpdate: () => {
                this._camera.position.x =
                    Math.cos(rotPos.angle) * rotPos.radius;
                this._camera.position.z =
                    Math.sin(rotPos.angle) * rotPos.radius;
                this._camera.lookAt(this._towerPosition);
            },
        });

    }

    public camera_diorama () : void {

        const camPos = this._camera.position;

        gsap.to(camPos, {
            x: Math.random() * 60 - 30,
            z: Math.random() * 60 - 30,
            y: Math.random() * 10 + 10,
            duration: 10,
            repeat: -1,
            onUpdate: () => {
                this._camera.lookAt(this._towerPosition);
            },
        });

    }

    public light_attention () : void {

        // this._sceneRenderer._spotLightArray.forEach( ( spotLight: THREE.SpotLight ) => {

        //     gsap.from(spotLight, {
        //         angle: 0,
        //         duration: 2,
        //         ease: Circ.easeIn,
        //     });

        // });

    }

}
