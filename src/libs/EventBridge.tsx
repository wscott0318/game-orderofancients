
type Callback = ( params: any ) => void;

//

export class EventBridgeCore {

    private reactEventsQueue: Map<string, Set<Callback> > = new Map();
    private reactEventListeners: Map<string, Set<Callback> > = new Map();

    private gfxEventsQueue: Map<string, Set<Callback> > = new Map();
    private gfxEventListeners: Map<string, Set<Callback> > = new Map();

    //

    constructor () {

        console.log('UIBridge initialized.');

    };

    public clear () : void {

        this.reactEventsQueue.clear();
        this.reactEventListeners.clear();

        this.gfxEventsQueue.clear();
        this.gfxEventListeners.clear();

    };

    public onUIEvent = ( eventName: string, callback: Callback ) : void => {

        let listeners = this.reactEventListeners.get( eventName );

        if ( ! listeners ) {

            listeners = new Set();
            this.reactEventListeners.set( eventName, listeners );

        }

        listeners.add( callback );

    };

    public removeUIEventListener ( eventName: string, callback: Callback ) : void {

        const listeners = this.reactEventListeners.get( eventName );

        if ( listeners ) {

            listeners.delete( callback );

            if ( ! listeners.size ) {

                this.gfxEventListeners.delete( eventName );

            }

        }

    };

    public dispatchToGame ( eventName: string, params?: any ) : void {

        let reactEvents = this.reactEventsQueue.get( eventName );

        if ( ! reactEvents ) {

            reactEvents = new Set();
            this.reactEventsQueue.set( eventName, reactEvents );

        }

        reactEvents.add( params );

    };

    //

    public onGameEvent ( eventName: string, callback: Callback ) : void {

        let listeners = this.gfxEventListeners.get( eventName );

        if ( ! listeners ) {

            listeners = new Set();
            this.gfxEventListeners.set( eventName, listeners );

        }

        listeners.add( callback );

    };

    public removeGameEventListener ( eventName: string, callback: Callback ) : void {

        const listeners = this.gfxEventListeners.get( eventName );

        if ( listeners ) {

            listeners.delete( callback );

            if ( ! listeners.size ) {

                this.gfxEventListeners.delete( eventName );

            }

        }

    };

    public dispatchToUI ( eventName: string, params: any = null ) : void {

        let gfxEvents = this.gfxEventsQueue.get( eventName );

        if ( ! gfxEvents ) {

            gfxEvents = new Set();
            this.gfxEventsQueue.set( eventName, gfxEvents );

        }

        gfxEvents.add( params );

        // tmp
        this.processEvents();

    };

    //

    public processEvents () : void {

        // process events sent to gfx

        this.gfxEventsQueue.forEach( ( paramsList, eventName ) => {

            const listeners = this.gfxEventListeners.get( eventName );

            if ( listeners && listeners.size ) {

                paramsList.forEach( ( params ) => {

                    listeners.forEach( ( listener ) => {

                        listener( params );

                    });

                });

            }

        });

        this.gfxEventsQueue.clear();

        // process events sent to react

        this.reactEventsQueue.forEach( ( paramsList, eventName ) => {

            const listeners = this.reactEventListeners.get( eventName );

            if ( listeners && listeners.size ) {

                paramsList.forEach( ( params ) => {

                    listeners.forEach( ( listener ) => {

                        listener( params );

                    });

                });

            }

        });

        this.reactEventsQueue.clear();

    };

};

export const EventBridge = new EventBridgeCore();
