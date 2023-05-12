import {
    AdditiveBlending,
    DoubleSide,
    Group,
    MeshBasicMaterial,
    Vector4,
} from "three";
import {
    BatchedRenderer,
    FrameOverLife,
    ParticleSystem,
    PointEmitter,
} from "three.quarks";
import { IntervalValue } from "three.quarks";
import { SizeOverLife } from "three.quarks";
import { PiecewiseBezier } from "three.quarks";
import { ColorRange } from "three.quarks";
import { ConstantColor } from "three.quarks";
import { SphereEmitter } from "three.quarks";
import { ConstantValue } from "three.quarks";
import { Bezier } from "three.quarks";
import { ColorOverLife } from "three.quarks";
import { RandomColor } from "three.quarks";
import { TextureImage } from "../AssetsManager";

// TODO
export function createElectricBall(
    renderer: BatchedRenderer,
    textures: TextureImage[]
) {
    const group = new Group();
    group.name = "ElectricBall";
    const texture2 = textures[1].texture;
    const beam = new ParticleSystem({
        duration: 1,
        looping: true,
        startLife: new ConstantValue(1.0),
        startSpeed: new ConstantValue(0),
        startSize: new ConstantValue(15.0),
        startColor: new ConstantColor(
            new Vector4(
                0.5220588 * 0.772549,
                0.6440161 * 0.772549,
                1 * 0.772549,
                0.772549
            )
        ),
        worldSpace: false,

        emissionOverTime: new ConstantValue(1),
        emissionBursts: [],
        shape: new PointEmitter(),
        material: new MeshBasicMaterial({
            map: texture2,
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
    renderer.addSystem(beam);

    const beamWorld = new ParticleSystem({
        duration: 1,
        looping: true,
        startLife: new IntervalValue(0.1, 0.4),
        startSpeed: new ConstantValue(0),
        startSize: new IntervalValue(7.5, 15),
        startColor: new RandomColor(
            new Vector4(0.1397059 * 0.8, 0.3592291 * 0.8, 1 * 0.8, 1),
            new Vector4(1 * 0.8, 0.9275356 * 0.8, 0.1029412 * 0.8, 1)
        ),
        worldSpace: true,

        emissionOverTime: new IntervalValue(5, 10),
        emissionBursts: [],
        shape: new SphereEmitter({
            radius: 0.01,
            thickness: 1,
            arc: Math.PI * 2,
        }),
        material: new MeshBasicMaterial({
            map: texture2,
            blending: AdditiveBlending,
            transparent: true,
            side: DoubleSide,
        }),
        startTileIndex: new ConstantValue(1),
        uTileCount: 10,
        vTileCount: 10,
        renderOrder: 0,
    });
    beamWorld.emitter.name = "beamWorld";
    beamWorld.addBehavior(
        new ColorOverLife(
            new ColorRange(
                new Vector4(1.0, 1.0, 1.0, 1.0),
                new Vector4(0.0, 0.0, 0.0, 1.0)
            )
        )
    );
    group.add(beamWorld.emitter);
    renderer.addSystem(beamWorld);

    const electricity = new ParticleSystem({
        duration: 0.5,
        looping: true,

        startLife: new IntervalValue(0.2, 0.3),
        startSpeed: new ConstantValue(0),
        startSize: new IntervalValue(3, 6),
        startRotation: new IntervalValue(-Math.PI, Math.PI),
        startColor: new RandomColor(
            new Vector4(0.1397059, 0.3592291, 1, 1),
            new Vector4(1, 0.9275356, 0.1029412, 1)
        ),
        worldSpace: true,

        emissionOverTime: new IntervalValue(5, 10),
        emissionBursts: [],

        shape: new PointEmitter(),
        material: new MeshBasicMaterial({
            map: texture2,
            blending: AdditiveBlending,
            transparent: true,
            side: DoubleSide,
        }),
        startTileIndex: new ConstantValue(0),
        uTileCount: 10,
        vTileCount: 10,
        renderOrder: 2,
    });
    electricity.addBehavior(
        new FrameOverLife(
            new PiecewiseBezier([[new Bezier(53, 56, 59, 62), 0]])
        )
    );
    electricity.addBehavior(
        new SizeOverLife(
            new PiecewiseBezier([[new Bezier(1.0, 1.0, 0.75, 0), 0]])
        )
    );
    electricity.emitter.name = "electricity";
    group.add(electricity.emitter);
    renderer.addSystem(electricity);

    const electricBall = new ParticleSystem({
        duration: 0.4,
        looping: true,

        startLife: new IntervalValue(0.2, 0.4),
        startSpeed: new ConstantValue(0),
        startSize: new IntervalValue(5, 10),
        startRotation: new IntervalValue(-Math.PI, Math.PI),
        startColor: new RandomColor(
            new Vector4(0.1397059, 0.3592291, 1, 1),
            new Vector4(1, 0.9275356, 0.1029412, 1)
        ),
        worldSpace: false,

        emissionOverTime: new ConstantValue(3),
        emissionBursts: [],

        shape: new PointEmitter(),
        material: new MeshBasicMaterial({
            map: texture2,
            blending: AdditiveBlending,
            transparent: true,
            side: DoubleSide,
        }),
        startTileIndex: new ConstantValue(0),
        uTileCount: 10,
        vTileCount: 10,
        renderOrder: 1,
    });
    electricBall.addBehavior(
        new FrameOverLife(
            new PiecewiseBezier([[new Bezier(62, 65, 68, 71), 0]])
        )
    );
    electricBall.emitter.name = "electricBall";
    group.add(electricBall.emitter);
    renderer.addSystem(electricBall);

    group.userData = {
        script:
            "    this.position.x += delta * 30;\n" +
            "    if (this.position.x > 20)\n" +
            "        this.position.x = -20;\n",
    };
    group.userData.func = new Function("delta", group.userData.script);
    return group;
}
