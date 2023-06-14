import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import { CAMERA_PROPS, SCENE_PROPS } from "../../../constants/rendering";

export const camera = (width: number, height: number) => {
    const _ASPECT = width / height;

    const cam = new THREE.PerspectiveCamera(
        CAMERA_PROPS.fov,
        _ASPECT,
        CAMERA_PROPS.near,
        CAMERA_PROPS.far
    );

    return cam;
};

export const scene = () => {
    const scene = new THREE.Scene();

    if (SCENE_PROPS.fog.enable) {
        scene.fog = new THREE.Fog(
            SCENE_PROPS.fog.color,
            SCENE_PROPS.fog.near,
            SCENE_PROPS.fog.far
        );

        // scene.fog = new THREE.FogExp2(SCENE_PROPS.fog.color, 0.009);
    }

    return scene;
};

export const renderer = (options: any) => {
    const renderer = new THREE.WebGLRenderer(options || {});
    return renderer;
};

export const HemiLight = () => {
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x437e49, 0.3);
    hemiLight.color.setHSL(0.6, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    return hemiLight;
};

export const PointLight = () => {
    const light = new THREE.PointLight(0xffffff, 0, 500);
    light.position.set(10, 60, 20);
    light.castShadow = true;
    light.shadow.mapSize.width = 256;
    light.shadow.mapSize.height = 256;
    light.shadow.bias = -0.001;
    light.decay = 2;

    return light;
};

export const SpotLight = () => {
    const spotLight = new THREE.SpotLight(0xffffff, 6);
    spotLight.position.set(10, 80, 20);
    spotLight.angle = Math.PI / 5;
    spotLight.penumbra = 1;
    spotLight.decay = 2;
    spotLight.distance = 150;

    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 512;
    spotLight.shadow.mapSize.height = 512;
    spotLight.shadow.camera.near = 10;
    spotLight.shadow.camera.far = 200;
    spotLight.shadow.bias = -0.001;
    spotLight.shadow.focus = 1;

    return spotLight;
};

export const StatGUI = () => {
    return new Stats();
};
