import {
    AdditiveBlending,
    DoubleSide,
    Group,
    MeshBasicMaterial,
    Vector4,
} from "three";
import {
    BatchedRenderer,
    Bezier,
    ConstantColor,
    ConstantValue,
    FrameOverLife,
    ParticleSystem,
    PiecewiseBezier,
    PointEmitter,
    RenderMode,
    SizeOverLife,
} from "three.quarks";
import { TextureImage } from "../../AssetsManager";

export function createAxeDamage(
    renderer: BatchedRenderer,
    textures: TextureImage[]
) {
    const group = new Group();
    group.name = "AxeDamage";

    const greyColor = new Vector4(0.76, 0.76, 0.76, 1);

    const texture = textures[0].texture;
    const secColor = greyColor;

    const circle = new ParticleSystem({
        duration: 1,
        looping: false,
        startLife: new ConstantValue(0.4),
        startSpeed: new ConstantValue(0),
        startSize: new ConstantValue(40),
        startColor: new ConstantColor(secColor),
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
        startTileIndex: new ConstantValue(10),
        uTileCount: 10,
        vTileCount: 10,
        renderMode: RenderMode.BillBoard,
        renderOrder: 2,
    });
    circle.addBehavior(
        new SizeOverLife(
            new PiecewiseBezier([[new Bezier(0.3, 0.6, 0.9, 1), 0]])
        )
    );
    circle.addBehavior(
        new FrameOverLife(
            new PiecewiseBezier([[new Bezier(10, 13, 16, 19), 0]])
        )
    );
    circle.emitter.name = "circle";
    group.add(circle.emitter);
    renderer.addSystem(circle);

    const circle2 = new ParticleSystem({
        duration: 1,
        looping: false,
        startLife: new ConstantValue(0.4),
        startSpeed: new ConstantValue(0),
        startSize: new ConstantValue(40),
        startColor: new ConstantColor(secColor),
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
        startTileIndex: new ConstantValue(10),
        uTileCount: 10,
        vTileCount: 10,
        renderMode: RenderMode.Mesh,
        renderOrder: 2,
    });
    circle2.addBehavior(
        new SizeOverLife(
            new PiecewiseBezier([[new Bezier(0.3, 0.6, 0.9, 1), 0]])
        )
    );
    circle2.addBehavior(
        new FrameOverLife(
            new PiecewiseBezier([[new Bezier(10, 13, 16, 19), 0]])
        )
    );
    circle2.emitter.name = "circle";
    circle2.emitter.rotation.x = Math.PI / 2;
    group.add(circle2.emitter);
    renderer.addSystem(circle2);
    return group;
}
