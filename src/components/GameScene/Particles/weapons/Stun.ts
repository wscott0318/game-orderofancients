import { Group } from "three";
import { BatchedRenderer, QuarksLoader } from "three.quarks";
import { TextureImage } from "../../AssetsManager";
import { S3_BUCKET_URL } from "../../../../constants";

export async function createStun(
    renderer: BatchedRenderer,
    textures: TextureImage[]
) {
    const group = new Group();
    group.name = "Stun";

    const loader = new QuarksLoader();

    const obj: THREE.Object3D = await new Promise((resolve, reject) => {
        loader.load(
            S3_BUCKET_URL + "/assets/particle_json/stun.json",
            (res: any) => {
                resolve(res);
            }
        );
    });

    const particleObj: any = obj.getObjectByName("tornado");

    particleObj.traverse((child: any) => {
        if (child.type === "ParticleEmitter") {
            renderer.addSystem(child.system);
        }
    });
    if (particleObj.type === "ParticleEmitter") {
        renderer.addSystem(particleObj.system);
    }
    group.add(particleObj);

    return group;
}
