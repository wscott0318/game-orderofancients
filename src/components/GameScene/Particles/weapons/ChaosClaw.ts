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

export function createChaosClaw(
    renderer: BatchedRenderer,
    textures: TextureImage[]
) {
    const group = new Group();
    const texture = textures[0].texture;
    group.name = "Chaow Claw";

    const beam = new ParticleSystem({
        duration: 1,
        looping: true,
        startLife: new ConstantValue(1.0),
        startSpeed: new ConstantValue(0),
        startSize: new ConstantValue(30.0),
        startColor: new ConstantColor(
            new Vector4(
                COLOR_NUMBER(27),
                COLOR_NUMBER(103),
                COLOR_NUMBER(24),
                0.772549
            )
        ),
        worldSpace: false,

        emissionOverTime: new ConstantValue(1),
        emissionBursts: [],
        shape: new PointEmitter(),
        material: new MeshBasicMaterial({
            map: texture,
            blending: AdditiveBlending,
            transparent: true,
            side: DoubleSide,
        }),
        startTileIndex: new ConstantValue(1),
        uTileCount: 10,
        vTileCount: 10,
        renderOrder: 0,
    });
    beam.emitter.name = "beam";
    group.add(beam.emitter);

    group.add(beam.emitter);
    renderer.addSystem(beam);

    const glowBeam = new ParticleSystem({
        duration: 1,
        looping: true,
        startLife: new ConstantValue(0.1),
        startSpeed: new ConstantValue(0),
        startSize: new ConstantValue(20),
        startColor: new ConstantColor(
            new Vector4(
                COLOR_NUMBER(35),
                COLOR_NUMBER(89),
                COLOR_NUMBER(8),
                0.772549
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
            new PiecewiseBezier([[new Bezier(1, 1.0, 0.8, 0.5), 0]])
        )
    );
    glowBeam.addBehavior(
        new ColorOverLife(
            new ColorRange(new Vector4(1, 1, 1, 1), new Vector4(0, 0, 0, 0))
        )
    );
    glowBeam.emitter.name = "glowBeam";

    group.add(glowBeam.emitter);
    renderer.addSystem(glowBeam);

    const particles = new ParticleSystem({
        duration: 1,
        looping: true,
        startLife: new IntervalValue(0.3, 0.6),
        startSpeed: new IntervalValue(20, 40),
        startSize: new IntervalValue(1, 2),
        startColor: new RandomColor(
            new Vector4(1, 1, 1, 0.5),
            new Vector4(0.5220588, 0.6440161, 1, 0.772549)
        ),
        worldSpace: false,

        emissionOverTime: new ConstantValue(60),

        shape: new ConeEmitter({
            angle: (80 / 180) * Math.PI,
            radius: 1,
            thickness: 0.3,
            arc: Math.PI * 2,
        }),
        material: new MeshBasicMaterial({
            map: texture,
            blending: NormalBlending,
            transparent: true,
            side: DoubleSide,
        }),
        renderMode: RenderMode.StretchedBillBoard,
        speedFactor: 0.2,
        startTileIndex: new ConstantValue(0),
        uTileCount: 10,
        vTileCount: 10,
        renderOrder: 0,
    });
    particles.addBehavior(
        new SizeOverLife(
            new PiecewiseBezier([[new Bezier(1, 0.25, 0.05, 0), 0]])
        )
    );
    particles.emitter.rotateY(-Math.PI / 2);
    particles.emitter.name = "particles";
    group.add(particles.emitter);
    renderer.addSystem(particles);

    group.userData = {
        script:
            "    this.position.x += delta * 200;\n" +
            "    if (this.position.x > 200)\n" +
            "        this.position.x = -200;\n",
    };
    group.userData.func = new Function("delta", group.userData.script);
    return group;
}
