
import { BufferAttribute, BufferGeometry, OrthographicCamera, Points, PointsMaterial, Scene, WebGLRenderer } from "three";
import { GameWorker } from "../../GameWorker";
import { TOWER_POSITIONS } from "../../../../constants/tower";

//

export class MinimapManager {

    private camera: OrthographicCamera = new OrthographicCamera( -1, 1, 1, -1, 0.5, 10 );
    private scene: Scene = new Scene();
    private renderer: WebGLRenderer;

    private unitsPoints: Points = new Points();
    private unitsBufferSize: number = 100;

    private towerPoints: Points = new Points();
    private towerBufferSize: number = 8;

    private minimapSize: number = 160;
    private mapSize: number = 175;

    //

    public init ( canvas: OffscreenCanvas ) : void {

        // setup environment

        this.renderer = new WebGLRenderer({ canvas });
        this.camera.position.set( 0, 1, 0 );
        this.camera.lookAt( 0, 0, 0 );

        this.renderer.setSize( this.minimapSize, this.minimapSize, false );
        this.renderer.setClearColor( 0x000000, 1 );

        // setup units points

        const unitsMaterial = new PointsMaterial({ size: 5, color: 0xff0000 });
        const unitsGeometry = new BufferGeometry();
        const unitsPositions = new Float32Array( this.unitsBufferSize * 3 );
        unitsGeometry.setAttribute( 'position', new BufferAttribute( unitsPositions, 3 ) );

        this.unitsPoints.material = unitsMaterial;
        this.unitsPoints.geometry = unitsGeometry;
        this.unitsPoints.geometry.drawRange.count = 0;
        this.unitsPoints.frustumCulled = false;
        this.scene.add( this.unitsPoints );

        // setup tower points

        const towerMaterial = new PointsMaterial({ size: 10, color: 0x00ff00 });
        const towerGeometry = new BufferGeometry();
        const towerPositions = new Float32Array( this.towerBufferSize * 3 );
        towerGeometry.setAttribute( 'position', new BufferAttribute( towerPositions, 3 ) );

        this.towerPoints.material = towerMaterial;
        this.towerPoints.geometry = towerGeometry;
        this.towerPoints.geometry.drawRange.count = 0;
        this.towerPoints.frustumCulled = false;
        this.scene.add( this.towerPoints );

    };

    public update () : void {

        const unitPositions = this.unitsPoints.geometry.attributes.position as BufferAttribute;
        const towerPositions = this.towerPoints.geometry.attributes.position as BufferAttribute;

        let index = 0;

        for ( let i = 0; i < GameWorker.arenaScene.towerManager.towersArray.length; i ++ ) {

            const tower = GameWorker.arenaScene.towerManager.towersArray[ i ];
            const units = tower.botManager.bots;

            for ( let j = 0; j < units.length; j ++ ) {

                unitPositions.setXYZ( index, units[ j ].position.x / this.mapSize - 0.5, 0, units[ j ].position.z / this.mapSize - 0.5 );

                index ++;

            }

            const position = TOWER_POSITIONS[ i ];
            towerPositions.setXYZ( i, position.x / this.mapSize - 0.5, 0, position.z / this.mapSize - 0.5 );

        }

        this.unitsPoints.geometry.drawRange.count = index;
        unitPositions.needsUpdate = true;

        this.towerPoints.geometry.drawRange.count = GameWorker.arenaScene.towerManager.towersArray.length;
        towerPositions.needsUpdate = true;

        this.renderer.render( this.scene, this.camera );

    };

};
