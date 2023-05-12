import {
    AdditiveBlending,
    CylinderGeometry,
    DoubleSide,
    Group,
    MeshBasicMaterial,
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
import { ConstantValue } from "three.quarks";
import { Bezier } from "three.quarks";
import { Gradient } from "three.quarks";
import { TextureImage } from "../AssetsManager";

export function createEnergyRifleMuzzle(
    renderer: BatchedRenderer,
    textures: TextureImage[]
) {
    const texture = textures[1].texture;
    const group = new Group();
    group.name = "EnergyRifleMuzzle";

    const particles = new ParticleSystem({
        duration: 1,
        looping: false,
        startLife: new IntervalValue(0.2, 0.6),
        startSpeed: new IntervalValue(20, 50),
        startSize: new ConstantValue(2),
        startColor: new ConstantColor(new Vector4(0.5, 0.5, 0.5, 1)),
        worldSpace: false,

        emissionOverTime: new ConstantValue(0),
        emissionBursts: [
            {
                time: 0,
                count: 24,
                cycle: 1,
                interval: 0.01,
                probability: 1,
            },
        ],

        shape: new ConeEmitter({ angle: 0.2, radius: 5 }),
        material: new MeshBasicMaterial({
            map: texture,
            blending: AdditiveBlending,
            transparent: true,
            side: DoubleSide,
        }),
        startTileIndex: new ConstantValue(0),
        uTileCount: 10,
        vTileCount: 10,
        renderMode: RenderMode.StretchedBillBoard,
        speedFactor: 0.1,
        renderOrder: 0,
    });
    particles.emitter.renderOrder = 0;
    particles.emitter.name = "particles";
    particles.addBehavior(
        new SizeOverLife(
            new PiecewiseBezier([[new Bezier(1, 0.95, 0.75, 0), 0]])
        )
    );
    particles.addBehavior(
        new ColorOverLife(
            new ColorRange(new Vector4(1, 1, 1, 1), new Vector4(0, 0.8, 1, 1))
        )
    );
    group.add(particles.emitter);
    renderer.addSystem(particles);

    const glowParam = {
        duration: 1,
        looping: false,
        startLife: new IntervalValue(0.6, 0.8),
        startSpeed: new ConstantValue(0),
        startSize: new IntervalValue(60, 80),
        startColor: new ConstantColor(new Vector4(0, 0.3, 0.3, 1)),
        worldSpace: false,

        emissionOverTime: new ConstantValue(0),
        emissionBursts: [
            {
                time: 0,
                count: 1,
                cycle: 1,
                interval: 0.01,
                probability: 1,
            },
        ],

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
        renderMode: RenderMode.BillBoard,
        renderOrder: -2,
    };

    const glow = new ParticleSystem(glowParam);
    glow.addBehavior(
        new ColorOverLife(
            new ColorRange(new Vector4(1, 1, 1, 1), new Vector4(0, 0, 0, 1))
        )
    );
    glow.emitter.name = "glow";
    glow.emitter.position.x = 1;
    group.add(glow.emitter);
    renderer.addSystem(glow);

    const glowTop = new ParticleSystem({
        duration: 1,
        looping: false,
        startLife: new IntervalValue(0.6, 0.8),
        startSpeed: new IntervalValue(0, 50),
        startSize: new IntervalValue(40, 60),
        startRotation: new ConstantValue(0),
        startColor: new ConstantColor(new Vector4(0, 0.2, 0.2, 1)),
        worldSpace: false,

        emissionOverTime: new ConstantValue(0),
        emissionBursts: [
            {
                time: 0,
                count: 5,
                cycle: 1,
                interval: 0.01,
                probability: 1,
            },
        ],

        shape: new ConeEmitter({ angle: 0.01, radius: 1 }),
        material: new MeshBasicMaterial({
            map: texture,
            blending: AdditiveBlending,
            transparent: true,
            side: DoubleSide,
        }),
        startTileIndex: new ConstantValue(1),
        uTileCount: 10,
        vTileCount: 10,
        renderMode: RenderMode.BillBoard,
        renderOrder: -2,
    });
    glowTop.emitter.name = "glowTop";
    glowTop.addBehavior(
        new ColorOverLife(
            new Gradient([
                [
                    new ColorRange(
                        new Vector4(1, 1, 1, 1),
                        new Vector4(1, 1, 1, 1)
                    ),
                    0,
                ],
                [
                    new ColorRange(
                        new Vector4(1, 1, 1, 1),
                        new Vector4(0, 0, 0, 1)
                    ),
                    0.5,
                ],
            ])
        )
    );
    group.add(glowTop.emitter);
    renderer.addSystem(glowTop);

    const coneBufferGeometry = new CylinderGeometry(10, 6, 4, 16, 1, true);
    coneBufferGeometry.rotateX(Math.PI / 2);

    const ringBase = new ParticleSystem({
        duration: 1,
        looping: false,
        startLife: new ConstantValue(0.8),
        startSpeed: new ConstantValue(0),
        startSize: new ConstantValue(1),
        startColor: new ConstantColor(new Vector4(0, 1, 1, 1)),
        worldSpace: false,

        emissionOverTime: new ConstantValue(0),
        emissionBursts: [
            {
                time: 0,
                count: 1,
                cycle: 1,
                interval: 0.01,
                probability: 1,
            },
        ],

        shape: new PointEmitter(),
        material: new MeshBasicMaterial({
            map: texture,
            blending: AdditiveBlending,
            transparent: true,
            side: DoubleSide,
        }),
        startTileIndex: new ConstantValue(91),
        uTileCount: 10,
        vTileCount: 10,
        instancingGeometry: coneBufferGeometry,
        renderMode: RenderMode.Mesh,
        renderOrder: 1,
    });
    ringBase.addBehavior(
        new ColorOverLife(
            new Gradient([
                [
                    new ColorRange(
                        new Vector4(1, 1, 1, 1),
                        new Vector4(1, 1, 1, 1)
                    ),
                    0,
                ],
                [
                    new ColorRange(
                        new Vector4(1, 1, 1, 1),
                        new Vector4(0, 0, 0, 1)
                    ),
                    0.5,
                ],
            ])
        )
    );
    ringBase.addBehavior(
        new SizeOverLife(
            new PiecewiseBezier([[new Bezier(0.5, 0.75, 0.95, 1), 0]])
        )
    );
    ringBase.emitter.name = "ringBase";
    group.add(ringBase.emitter);
    renderer.addSystem(ringBase);
    return group;
}
