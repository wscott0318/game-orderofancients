
import { PerspectiveCamera, Scene } from "three";
import { CSS2DObject, CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";

//

export class UIRenderer {

    private renderer: CSS2DRenderer;
    private camera: PerspectiveCamera;

    private scene: Scene;
    private elements: Map<string, CSS2DObject> = new Map();

    private inited: boolean = false;

    //

    public init ( dom: HTMLDivElement ) : void {

        this.scene = new Scene();
        this.camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

        this.renderer = new CSS2DRenderer();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.domElement.style.position = 'absolute';
        this.renderer.domElement.style.top = '0';
        this.renderer.domElement.style.pointerEvents = 'none';

        dom.appendChild( this.renderer.domElement );

        window.addEventListener( 'resize', this.resize );
        this.resize();

        this.inited = true;

        this.render();

    };

    public setCameraPosition = ( params: { pos: { x: number, y: number, z: number }, target: { x: number, y: number, z: number } } ) : void => {

        if ( ! this.inited ) return;

        const pos = params.pos;
        const target = params.target;

        this.camera.position.set( pos.x, pos.y, pos.z );
        this.camera.lookAt( target.x, target.y, target.z );

    };

    public addElement = ( params: { id: string, styles: any, props: any } ) : void => {

        if ( ! this.inited ) return;

        const styles = params.styles ?? {};
        const id = params.id;

        const element = document.createElement( 'div' );
        element.id = id;

        for ( const key in styles ) {

            // @ts-ignore
            element.style[ key ] = styles[ key ];

        }

        for ( const key in params.props ) {

            // @ts-ignore
            element[ key ] = params.props[ key ];

        }

        const cssObject = new CSS2DObject( element );

        this.elements.set( id, cssObject );
        this.scene.add( cssObject );

    };

    public removeElement = ( params: { id: string } ) : void => {

        if ( ! this.inited ) return;

        const id = params.id;

        const element = this.elements.get( id );
        if ( ! element ) return;

        this.scene.remove( element );
        this.elements.delete( id );

    };

    public setElementPosition = ( params: { id: string, position: { x: number, y: number, z: number } } ) : void => {

        if ( ! this.inited ) return;

        const position = params.position;

        const element = this.elements.get( params.id );
        if ( ! element ) return;

        element.position.set( position.x, position.y, position.z );

    };

    public updateElement = ( params: { id: string, class: string, styles: any, props: any } ) : void => {

        if ( ! this.inited ) return;

        const id = params.id;
        const styles = params.styles ?? {};
        const props = params.props ?? {};

        const element = this.elements.get( id );
        if ( ! element ) return;
        let elementDom;

        if ( ! params.class ) {

            elementDom = element.element;

        } else {

            elementDom = element.element.querySelector( `.${ params.class }` );
            element.userData.cache = element.userData.cache || {};
            element.userData.cache[ params.class ] = elementDom;

        }

        if ( ! elementDom ) return;

        for ( const key in styles ) {

            // @ts-ignore
            elementDom.style[ key ] = styles[ key ];

        }

        for ( const key in props ) {

            // @ts-ignore
            elementDom[ key ] = props[ key ];

        }

    };

    public render = () : void => {

        if ( ! this.inited ) return;

        this.renderer.render( this.scene, this.camera );

        requestAnimationFrame( this.render );

    };

    //

    private resize = () : void => {

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize( window.innerWidth, window.innerHeight );

    };

};
