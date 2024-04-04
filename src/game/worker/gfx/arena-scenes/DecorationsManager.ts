
import { Object3D, Scene } from "three";

//

export class DecorationManager {

    private wrapper: Object3D;

    //

    public init ( scene: Scene ) : void {

        this.wrapper = new Object3D();
        scene.add( this.wrapper );

        // tmp

        const config: any = [
            { type: 'tree1', items: [] },
            { type: 'tree2', items: [] }
        ];

        for ( let i = 0; i < config.length; i ++ ) {

            const itemType = config[ i ];

            for ( let j = 0; j < itemType.items.length; j ++ ) {

                //

            }

        }

    };

};
