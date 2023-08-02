import * as THREE from "three";

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
        y: 80,
        z: 25,
    },
};

export const SCENE_PROPS = {
    fog: {
        enable: true,
        color: 0xcccccc,
        near: 90,
        far: 200,
    },
};
