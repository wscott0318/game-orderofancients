import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export const LoadModel = (src: any, shadow = true) => {
    return new Promise((resolve) => {
        const loader = new GLTFLoader();

        loader.load(src, function (gltf) {
            const mesh = gltf.scene;

            mesh.traverse((obj: any) => {
                if (shadow && (obj.isMesh || obj.isSkinnedMesh)) {
                    obj.castShadow = true;
                    obj.receiveShadow = true;
                    if (obj.material.map) obj.material.map.anisotropy = 16;
                }
            });

            resolve(mesh);
        });
    });
};
