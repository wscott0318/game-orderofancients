
export const GameEvents = {

    SET_STATE: 'SetState',

    INIT_CONFIG: 'InitConfig',
    WORKER_INITED: 'WorkerInited',

    INIT_NETWORK: 'InitNetwork',
    NETWORK_INITED: 'NetworkInited',

    INIT_GFX: 'InitGFX',
    RESIZE_GFX: 'ResizeGFX',

    LOAD_ASSETS: 'LoadAssets',
    ASSETS_LOADING_PROGRESS_UPDATE: 'AssetsLoadingProgressUpdate',
    ASSETS_LOADING_FINISHED: 'AssetsLoadingFinished',

    LOBBY_EXIT_ROOM: 'LobbyExitRoom',
    LOBBY_JOIN: 'LobbyJoin',
    PLAY_SINGLE: 'PlaySingle',
    SET_LOBBY_DATA: 'SetLobbyData',
    TICK_ROUND: 'TickRound',

    START_GAME: 'StartGame',
    UPDATE_TIME: 'UpdateTime',
    SET_PLAYER_UPGRADES: 'SetPlayerUpgrades',
    SET_PLAYER_HEALTH: 'SetPlayerHealth',
    SET_PLAYER_GOLD: 'SetPlayerGold',
    SET_PLAYER_INCOME: 'SetPlayerIncome',
    SET_ARENA_STATS: 'SetArenaStats',

    GFX_TOGGLE_GRID: 'GfxToggleGrid',

    UI_CLEAR: 'UIClear',
    UI_SET_CAMERA_POSITION: 'UISetCameraPosition',
    UI_ADD_ELEMENT: 'UIAddElement',
    UI_REMOVE_ELEMENT: 'UIRemoveElement',
    UI_UPDATE_ELEMENT: 'UIUpdateElement',
    UI_SET_ELEMENT_POSITION: 'UISetElementPosition',

    DISPOSE: 'Dispose'

};
