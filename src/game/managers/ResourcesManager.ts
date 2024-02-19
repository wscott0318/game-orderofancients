
import { Texture, TextureLoader } from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { MODEL_URLS, S3_BUCKET_URL } from "../../constants";
import { AssetsList } from "./AssetsList";

//

class ResourcesManagerCore {

    public _isLoaded: boolean = false;

    public _textures: Map<string, Texture> = new Map();
    public _models: Map<string, GLTF> = new Map();

    private _texturesToLoad: { name: string, path: string }[];
    private _modelsToLoad: { name: string, path: string }[];

    private _texturesToLoadCount: number;
    private _modelsToLoadCount: number;

    private _texturesLoadedCount: number;
    private _modelsLoadedCount: number;

    private _textureLoader: TextureLoader;
    private _gltfLoader: GLTFLoader;

    public _particleTextures: any;

    private _callback: () => void;
    private _progressCallback: ( progress: number ) => void;

    //

    public load ( progressCallback: ( progress: number ) => void, callback: () => void ) : void {

        this._isLoaded = false;
        this._progressCallback = progressCallback;
        this._callback = callback;

        // init loaders

        this._textureLoader = new TextureLoader();
        this._gltfLoader = new GLTFLoader();

        //

        this._texturesToLoad = [ ... AssetsList.textures ];
        this._modelsToLoad = [ ... AssetsList.models ];

        this._texturesLoadedCount = 0;
        this._modelsLoadedCount = 0;

        this._texturesToLoadCount = this._texturesToLoad.length;
        this._modelsToLoadCount = this._modelsToLoad.length;

        //

        this.loadNextModel();
        this.loadNextTexture();

    }

    public getTexture ( textureName: string ) : Texture | null {

        const texture = this._textures.get( textureName );

        if ( ! texture ) {

            console.error( "Texture not found: " + textureName );

        }

        return texture ?? null;

    }

    public getModel ( modelName: string ) : GLTF | null {

        const model = this._models.get( modelName );

        if ( ! model ) {

            console.error( "Model not found: " + modelName );

        }

        return model ?? null;

    }

    //

    private isFinishedLoading () : boolean {

        if ( this._isLoaded ) return true;

        const isFinishedLoading = this._texturesLoadedCount === this._texturesToLoadCount && this._modelsLoadedCount === this._modelsToLoadCount;
        const progress = ( this._texturesLoadedCount + this._modelsLoadedCount ) / ( this._texturesToLoadCount + this._modelsToLoadCount );

        this._progressCallback( progress );

        if ( isFinishedLoading ) {

            this._isLoaded = true;
            this._callback();

        }

        return isFinishedLoading;

    }

    private loadNextModel () : void {

        const asset = this._modelsToLoad.pop();

        if ( this.isFinishedLoading() ) return;
        if ( ! asset ) return;

        this._gltfLoader.load( asset.path, ( gltf ) => {

            this._models.set( asset.name, gltf );
            this._modelsLoadedCount ++;
            // todo: update progress

            if ( ! this.isFinishedLoading() ) {

                this.loadNextModel();

            }

        });

    }

    private loadNextTexture () : void {

        const asset = this._texturesToLoad.pop();

        if ( this.isFinishedLoading() ) return;
        if ( ! asset ) return;

        this._textureLoader.load( asset.path, ( texture ) => {

            this._textures.set( asset.name, texture );
            this._texturesLoadedCount ++;
            // todo: update progress

            if ( ! this.isFinishedLoading() ) {

                this.loadNextTexture();

            }

        });

    }

}

export const ResourcesManager = new ResourcesManagerCore();
