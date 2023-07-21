import {
    AdditiveBlending,
    DoubleSide,
    Group,
    MeshBasicMaterial,
    NormalBlending,
    Vector4,
} from "three";
import {
    BatchedRenderer,
    ColorOverLife,
    ParticleSystem,
    PointEmitter,
    RenderMode,
} from "three.quarks";
import { ConeEmitter } from "three.quarks";
import { IntervalValue } from "three.quarks";
import { SizeOverLife } from "three.quarks";
import { PiecewiseBezier } from "three.quarks";
import { ColorRange } from "three.quarks";
import { ConstantColor } from "three.quarks";
import { SphereEmitter } from "three.quarks";
import { ConstantValue } from "three.quarks";
import { Bezier } from "three.quarks";
import { RandomColor } from "three.quarks";
import { TextureImage } from "../../AssetsManager";
import { COLOR_NUMBER } from "../../../../utils/helper";

export function createFireBow(
    renderer: BatchedRenderer,
    textures: TextureImage[]
) {
    const group = new Group();
    const texture = textures[0].texture;
    group.name = "FireBow";

    const glowBeam = new ParticleSystem({
        duration: 1,
        looping: true,
        startLife: new ConstantValue(1),
        startSpeed: new ConstantValue(0),
        startSize: new ConstantValue(5),
        startColor: new ConstantColor(
            new Vector4(
                COLOR_NUMBER(177),
                COLOR_NUMBER(84),
                COLOR_NUMBER(47),
                1
            )
        ),
        worldSpace: true,

        emissionOverTime: new ConstantValue(120),

        shape: new SphereEmitter({
            radius: 0.0001,
            thickness: 1,
            arc: Math.PI * 2,
        }),
        material: new MeshBasicMaterial({
            map: texture,
            blending: AdditiveBlending,
            transparent: true,
            side: DoubleSide,
        }),
        startTileIndex: new ConstantValue(1),
        uTileCount: 10,
        vTileCount: 10,
        renderOrder: 2,
    });
    glowBeam.addBehavior(
        new SizeOverLife(
            new PiecewiseBezier([[new Bezier(1, 0.07, 0.17, 0.1), 0]])
        )
    );
    glowBeam.addBehavior(
        new ColorOverLife(
            new ColorRange(
                new Vector4(
                    COLOR_NUMBER(177),
                    COLOR_NUMBER(84),
                    COLOR_NUMBER(47),
                    1
                ),
                new Vector4(
                    COLOR_NUMBER(177),
                    COLOR_NUMBER(84),
                    COLOR_NUMBER(47),
                    1
                )
            )
        )
    );
    glowBeam.emitter.name = "glowBeam";

    group.add(glowBeam.emitter);
    renderer.addSystem(glowBeam);

    return group;
}
