import * as THREE from "three";

export const MODEL_URLS = {
    environment: "/assets/models/environment/foliage_pack_final.gltf",
    buildings: "/assets/models/building/scene.gltf",
    bot_grunt: "/assets/models/skeleton_grunt/scene.gltf",
    bot_swordsman: "/assets/models/skeleton_swordsman/scene.gltf",
    bot_archer: "/assets/models/skeleton_archer/scene.gltf",
    bot_king: "/assets/models/skeleton_king/scene.gltf",
    bot_mage: "/assets/models/skeleton_mage/scene.gltf",
};

export const FOREST_RADIUS = 35;

export const GAME_STATES = {
    GAME_MENU: 0x01,
    PLAYING: 0x02,
    PAUSE: 0x03,
    END: 0x04,
};

export const CAMERA_POS = {
    sideView: new THREE.Vector3(40, 30, 0),
};

export const ROUND_TIME = 30;

export const START_GOLD_GEN = 50;
