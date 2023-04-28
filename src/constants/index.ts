import * as THREE from "three";

export const MODEL_URLS = {
    environment: "/assets/models/environment/foliage_pack_final.gltf",
    buildings: "/assets/models/building/scene.gltf",
    bot_grunt: "/assets/models/skeleton_grunt/scene.gltf",
    bot_swordsman: "/assets/models/skeleton_swordsman/scene.gltf",
    bot_archer: "/assets/models/skeleton_archer/scene.gltf",
};

export const RENDERER_PROPS = {
    antialias: true,
    outputEncoding: THREE.sRGBEncoding,
    toneMapping: THREE.ACESFilmicToneMapping,
    shadowMapEnable: true,
};

export const CAMERA_PROPS = {
    fov: 45,
    near: 0.1,
    far: 20000,
    position: {
        x: 15,
        y: 69,
        z: 30,
    },
};

export const SCENE_PROPS = {
    fog: {
        enable: true,
        color: 0xcccccc,
        near: 70,
        far: 150,
    },
};

export const BOT_TYPE = {
    grunt: 0x01,
    swordsman: 0x02,
    archer: 0x03,
} as any;

export const ANIMATION_TYPE = {
    walk: 0x01,
    attack: 0x02,
    dead: 0x03,
} as any;

export const BOT_STATUS = {
    walk: 0x01,
    attack: 0x02,
    dead: 0x03,
} as any;

export const BOT_ANIMATION_CLIPS = {
    [BOT_TYPE["grunt"]]: {
        walk: {
            startFrame: 1280,
            endFrame: 1350,
        },
        attack: {
            startFrame: 684,
            endFrame: 763,
        },
        dead: {
            startFrame: 72,
            endFrame: 99,
        },
    },
    [BOT_TYPE["swordsman"]]: {
        walk: {
            startFrame: 1048,
            endFrame: 1104,
        },
        attack: {
            startFrame: 122,
            endFrame: 200,
        },
        dead: {
            startFrame: 201,
            endFrame: 231,
        },
    },
    [BOT_TYPE["archer"]]: {
        walk: {
            startFrame: 940,
            endFrame: 1011,
        },
        attack: {
            startFrame: 72,
            endFrame: 108,
        },
        dead: {
            startFrame: 170,
            endFrame: 199,
        },
    },
};

export const BOT_PROPS = {
    attackRange: {
        [BOT_TYPE["grunt"]]: 1.5,
        [BOT_TYPE["swordsman"]]: 0.2,
        [BOT_TYPE["archer"]]: 3.5,
    },
    healthPoint: {
        [BOT_TYPE["grunt"]]: 550,
        [BOT_TYPE["swordsman"]]: 450,
        [BOT_TYPE["archer"]]: 300,
    },
    modelHeight: {
        [BOT_TYPE["grunt"]]: 3,
        [BOT_TYPE["swordsman"]]: 2.8,
        [BOT_TYPE["archer"]]: 2,
    },
};

export const TOWER_RADIUS = 4;

export const TOWER_POSITION = {
    x: 0,
    y: 0,
    z: 0,
};

export const TOWER_HEIGHT = 11;

export const FOREST_RADIUS = 20;
