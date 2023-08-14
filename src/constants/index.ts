import * as THREE from "three";

export const MODEL_URLS = {
    environment: "/assets/models/environment/foliage_pack_final.gltf",
    buildings: "/assets/models/building/scene.gltf",
    bot_grunt: "/assets/models/skeleton_grunt/scene.gltf",
    bot_swordsman: "/assets/models/skeleton_swordsman/scene.gltf",
    bot_archer: "/assets/models/skeleton_archer/scene.gltf",
    bot_king: "/assets/models/skeleton_king/scene.gltf",
    bot_mage: "/assets/models/skeleton_mage/scene.gltf",

    throwingAxe: "/assets/models/weapons/throwingAxe/scene.gltf",
    arrow: "/assets/models/weapons/arrow/overwatch_-_hanzos_arrow.glb",
    missile: "/assets/models/weapons/missile/hi-tech_missile.glb",
    stone: "/assets/models/weapons/stone/groundstone_sphere.glb",
};

export const FOREST_RADIUS = 35;

export const GAME_STATES = {
    GAME_MENU: 0x01,
    PLAYING: 0x02,
    PAUSE: 0x03,
    END: 0x04,
    SETTING: 0x05,
};

export const CAMERA_POS = {
    sideView: new THREE.Vector3(40, 30, 0),
};

export const ROUND_TIME = 30;

export const START_GOLD_GEN = 50;

export const DAMAGE_TYPES = {
    Normal: 0x01,
    Piercing: 0x02,
    Magic: 0x03,
    Siege: 0x04,
    Chaos: 0x05,
};

export const DAMAGE_TYPES_TEXT = {
    0x01: "Normal",
    0x02: "Piercing",
    0x03: "Magic",
    0x04: "Siege",
    0x05: "Chaos",
};

export const ARMOR_TYPES = {
    Unarmored: 0x01,
    Light: 0x02,
    Medium: 0x03,
    Heavy: 0x04,
    Fortified: 0x05,
    Divine: 0x06,
};

export const ARMOR_TYPES_TEXT = {
    0x01: "Unarmored",
    0x02: "Light",
    0x03: "Medium",
    0x04: "Heavy",
    0x05: "Fortified",
    0x06: "Divine",
};

export const DAMAGE_TEXT_COLORS = {
    [DAMAGE_TYPES.Normal]: "#848C92",
    [DAMAGE_TYPES.Piercing]: "#cfbf46",
    [DAMAGE_TYPES.Magic]: "#66acc7",
    [DAMAGE_TYPES.Siege]: "#c7a166",
    [DAMAGE_TYPES.Chaos]: "#66c76a",
};
