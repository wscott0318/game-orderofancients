import * as THREE from "three";

export const MODEL_URLS = {
    environment: "/assets/models/environment/scene.gltf",
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
        x: 10,
        y: 30,
        z: 20,
    },
};

export const SCENE_PROPS = {
    fog: {
        enable: true,
        color: 0xcccccc,
        near: 30,
        far: 100,
    },
};
