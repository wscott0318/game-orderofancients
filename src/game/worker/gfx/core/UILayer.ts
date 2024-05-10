
import { Matrix4, PerspectiveCamera, Quaternion, Vector2, Vector3 } from "three";
import { Gfx } from "./Gfx";

//

const _vec3_1 = new Vector3();
const _vec3_2 = new Vector3();
const _quaternion = new Quaternion();

function shiftColor ( value: string, delta: number ) : string {

    let r = 0;
    let g = 0;
    let b = 0;

    if ( value.indexOf( 'rgb(' ) !== -1 ) {

        r = parseInt( value.split( ',' )[ 0 ].split( '(' )[ 1 ] );
        g = parseInt( value.split( ',' )[ 1 ] );
        b = parseInt( value.split( ',' )[ 2 ].split( ')' )[ 0 ] );

    } else {

        const num = parseInt( value.replace( '#', '' ), 16 );
        r = ( num >> 16 );
        g = ( num >> 8 & 0x00FF );
        b = ( num & 0x0000FF );

    }

    r += delta;
    g += delta;
    b += delta;

    r = Math.min( 255, Math.max( 0, r ) );
    g = Math.min( 255, Math.max( 0, g ) );
    b = Math.min( 255, Math.max( 0, b ) );

    return `rgb(${ r },${ g },${ b })`;

};

//

interface IUIElementProps {
    name:           string;
    position?:      Vector3;
    zIndex?:        number;
    visible?:       boolean;
    opacity?:       number;
    vAlign?:        'center' | 'bottom' | 'top';
    hAlign?:        'center' | 'left' | 'right';
    width?:         number;
    height?:        number;
    offset?:        Vector2;
    text?:          string;
    font?:          string;
    textColor?:     string;
    fontSize?:      number;
};

export class UIElement {

    public name: string = '';
    public projectedPosition: Vector3 = new Vector3();
    public accumulatedOffset: Vector2 = new Vector2();
    public modelMatrix: Matrix4 = new Matrix4();

    public position: Vector3 = new Vector3();
    public offset: Vector2 = new Vector2();
    public zIndex: number = 0;
    public visible: boolean = true;
    public opacity: number = 1;
    public vAlign: 'center' | 'bottom' | 'top' = 'center';
    public hAlign: 'center' | 'left' | 'right' = 'center';
    public width: number = 100;
    public height: number = 100;

    public parent: UIElement = null;
    public children: UIElement[] = [];
    public isText: boolean = false;
    public isRect: boolean = false;

    public text: string = '';
    public font: string = 'Arial';
    public textColor: string = '#000000';
    public fontSize: number = 16;

    //

    constructor ( params: IUIElementProps ) {

        this.name = params.name;

        if ( params.position !== undefined ) this.position.copy( params.position );
        if ( params.zIndex !== undefined ) this.zIndex = params.zIndex;
        if ( params.visible !== undefined ) this.visible = params.visible;
        if ( params.opacity !== undefined ) this.opacity = params.opacity;
        if ( params.vAlign !== undefined ) this.vAlign = params.vAlign;
        if ( params.hAlign !== undefined ) this.hAlign = params.hAlign;
        if ( params.width !== undefined ) this.width = params.width;
        if ( params.height !== undefined ) this.height = params.height;
        if ( params.offset !== undefined ) this.offset.copy( params.offset );
        if ( params.text !== undefined ) this.text = params.text;
        if ( params.font !== undefined ) this.font = params.font;
        if ( params.textColor !== undefined ) this.textColor = params.textColor;
        if ( params.fontSize !== undefined ) this.fontSize = params.fontSize;

    };

    public add ( item: UIElement ) : void {

        this.children.push( item );
        item.parent = this;

    };

    public remove ( item: UIElement ) : void {

        const index = this.children.indexOf( item );

        if ( index !== -1 ) {

            this.children.splice( index, 1 );

        }

        item.parent = null;

    };

    public traverse = ( callback: ( item: UIElement ) => void ) : void => {

        callback( this );

        for ( let i = 0; i < this.children.length; i ++ ) {

            this.children[ i ].traverse( callback );

        }

    };

};

interface IUIRectProps extends IUIElementProps {
    color?: string;
    innerShadow?: boolean;
};

export class UIRect extends UIElement {

    public color: string = '#000000';
    public innerShadow: boolean = false;

    public isRect: boolean = true;

    constructor ( props: IUIRectProps ) {

        super( props );

        if ( props.color !== undefined ) this.color = props.color;
        if ( props.innerShadow !== undefined ) this.innerShadow = props.innerShadow;

    };

};

interface IUITextProps extends IUIElementProps {
    text?: string;
    font?: string;
    color?: string;
};

export class UIText extends UIElement {

    public text: string = '';
    public font: string = 'Arial';
    public color: string = '#000000';

    public isText: boolean = true;

    //

    constructor ( props: IUITextProps ) {

        super( props );

        if ( props.text !== undefined ) this.text = props.text;
        if ( props.font !== undefined ) this.font = props.font;
        if ( props.color !== undefined ) this.color = props.color;

    };

};

//

export class UILayerCore {

    public items: UIElement[] = [];

    public uiCanvas: OffscreenCanvas = null;
    public ctx: OffscreenCanvasRenderingContext2D = null;

    public scene: UIElement = new UIElement({ name: 'root' });

    //

    public init = () : void => {

        this.ctx = this.uiCanvas.getContext( '2d' );

    };

    public add ( item: UIElement ) : void {

        this.scene.add( item );

    };

    public remove ( item: UIElement ) : void {

        this.scene.remove( item );

    };

    public resize ( width: number, height: number ) : void {

        this.uiCanvas.width = width;
        this.uiCanvas.height = height;

    };

    public render = ( camera: PerspectiveCamera ) : void => {

        this.ctx.clearRect( 0, 0, this.uiCanvas.width, this.uiCanvas.height );

        this.scene.traverse( ( item: UIElement ) => {

            item.modelMatrix.identity().setPosition( item.position );
            if ( item.parent ) item.modelMatrix.premultiply( item.parent.modelMatrix );

            item.modelMatrix.decompose( _vec3_1, _quaternion, _vec3_2 );

            item.projectedPosition.copy( _vec3_1 ).project( camera );

            const scaleFactor = 20;
            const scale = Math.sqrt( _vec3_2.subVectors( _vec3_1, camera.position ).length() / scaleFactor );

            let x = ( item.projectedPosition.x * 0.5 + 0.5 ) * this.uiCanvas.width;
            let y = ( - item.projectedPosition.y * 0.5 + 0.5 ) * this.uiCanvas.height;

            const w = item.width / scale;
            const h = item.height / scale;

            if ( ! item.parent ) {

                item.accumulatedOffset.set( 0, 0 );

            } else {

                item.accumulatedOffset.x = item.parent.accumulatedOffset.x + item.offset.x / scale;
                item.accumulatedOffset.y = item.parent.accumulatedOffset.y + item.offset.y / scale;

            }

            // if ( item.hAlign === 'left' ) x -= item.width / 2;
            if ( item.hAlign === 'center' ) item.accumulatedOffset.x -= w * 0.25;
            if ( item.hAlign === 'right' ) item.accumulatedOffset.x += w;

            // if ( item.vAlign === 'center' ) y += item.height * 0.5;
            if ( item.vAlign === 'bottom' ) item.accumulatedOffset.y += h;

            x += item.accumulatedOffset.x;
            y += item.accumulatedOffset.y;

            if ( item.isRect ) {

                const rect = item as UIRect;

                this.ctx.fillStyle = rect.color;
                this.ctx.globalAlpha = rect.opacity;
                this.ctx.fillRect( x, y, w, h );

                const shadowWidth = 2 / scale;

                if ( rect.innerShadow ) {

                    const darkerColor = shiftColor( rect.color, -50 );
                    const lighterColor = shiftColor( rect.color, 50 );
                    let grd;

                    // top light gradient
                    grd = this.ctx.createLinearGradient( x, y, x, y + shadowWidth );
                    grd.addColorStop( 0, lighterColor );
                    grd.addColorStop( 1, rect.color );
                    this.ctx.fillStyle = grd;
                    this.ctx.fillRect( x, y, w, shadowWidth );

                    // left light gradient
                    grd = this.ctx.createLinearGradient( x, y, x + shadowWidth, y );
                    grd.addColorStop( 0, lighterColor );
                    grd.addColorStop( 1, rect.color );
                    this.ctx.fillStyle = grd;
                    this.ctx.fillRect( x, y, shadowWidth, h );

                    // bottom dark gradient
                    grd = this.ctx.createLinearGradient( x, y + h, x, y + h - shadowWidth );
                    grd.addColorStop( 0, darkerColor );
                    grd.addColorStop( 1, rect.color );
                    this.ctx.fillStyle = grd;
                    this.ctx.fillRect( x, y + h - shadowWidth, w, shadowWidth );

                    // right dark gradient
                    grd = this.ctx.createLinearGradient( x + w, y, x + w - shadowWidth, y );
                    grd.addColorStop( 0, darkerColor );
                    grd.addColorStop( 1, rect.color );
                    this.ctx.fillStyle = grd;
                    this.ctx.fillRect( x + w - shadowWidth, y, shadowWidth, h );

                }

                if ( rect.text ) {

                    this.ctx.fillStyle = rect.textColor;
                    this.ctx.textAlign = 'center';
                    this.ctx.font = `${ rect.fontSize / scale }px ${ rect.font }`;
                    this.ctx.fillText( rect.text, x + w / 2, y + h - 7 );

                }

            }

        });

        // render stats block

        this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
        this.ctx.fillRect( 0, 0, 100, 50 );
        this.ctx.fillStyle = '#ffffff';
        this.ctx.textAlign = 'left';
        this.ctx.fillText( 'FPS: ' + Gfx.fps, 10, 12 );
        this.ctx.fillText( 'Calls: ' + Gfx.renderer.info.render.calls, 10, 27 );
        this.ctx.fillText( 'Triangles: ' + Gfx.renderer.info.render.triangles, 10, 42 );

    };

};

//

export const UILayer = new UILayerCore();
