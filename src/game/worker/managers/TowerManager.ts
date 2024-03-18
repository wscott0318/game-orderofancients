
import { TowerEntity } from "../entities/Tower.Entity";

//

export class TowerManager {

    public towersArray: TowerEntity[] = [];

    //

    public get ( index: number ) : TowerEntity {

        return this.towersArray[ index ];

    };

    public add ( tower: TowerEntity ) : void {

        this.towersArray.push( tower );

    };

    public remove ( tower: TowerEntity ) : void {

        const index = this.towersArray.indexOf( tower );

        if ( index !== -1 ) {

            this.towersArray.splice( index, 1 );

        }

    };

    public update () : void {

        for ( let i = 0; i < this.towersArray.length; i++ ) {

            const tower = this.towersArray[ i ];
            tower.update();

        }

    };

    public dispose () : void {

        for ( let i = 0; i < this.towersArray.length; i++ ) {

            this.towersArray[ i ].dispose();

        }

        this.towersArray = [];

    };

};
