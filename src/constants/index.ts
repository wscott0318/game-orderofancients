import * as THREE from "three";

export const MODEL_URLS = {
    environment: "/assets/models/environment/foliage_pack_final.gltf",
    tower: "/assets/models/building/scene.gltf",
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
