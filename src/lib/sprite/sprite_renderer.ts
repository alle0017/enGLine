import { Program } from '../../rendering/program.js';
import { Sprite } from './sprite.js';
import { FRAGMENT, VERTEX } from './shaders.js';
import { World } from '../../ecs/world.js';
import { PositionSystem } from '../position/position_system.js';
import { VertexBuffer } from '../../rendering/vertex_buffer.js';
import { Binding, GLType, Primitives } from '../../rendering/enum.js';
import { Texture } from '../../rendering/texture.js';
import { Renderer } from '../rendering/renderer.js';
import { System, Updatable } from '../../ecs/system.js';

export class SpriteRenderer extends System<Sprite> implements Updatable {
      readonly name: string = 'sprite';

      private readonly positions: PositionSystem;
      public readonly program: Program;
      private readonly translation: VertexBuffer;
      private readonly rotations: VertexBuffer;
      private readonly indices: VertexBuffer;
      private readonly textureCoords: VertexBuffer;
      private readonly texture: Texture;
      private readonly renderer: Renderer;
      private dirty: boolean = true;
      
      constructor(world: World) {
            super(world);
            const renderer = this.inject(Renderer);
            this.renderer = renderer;
            this.program = new Program(renderer.pass, VERTEX, FRAGMENT);
            this.positions = this.inject(PositionSystem);

            this.translation = new VertexBuffer(renderer.pass, 'a_translation', Binding.DYNAMIC).setSize(3);
            this.rotations = new VertexBuffer(renderer.pass, 'a_rotations', Binding.DYNAMIC).setSize(3);
            this.textureCoords = new VertexBuffer(renderer.pass, 'a_texCoord', Binding.DYNAMIC).setSize(2);
            this.indices = new VertexBuffer(renderer.pass, 'a_position', Binding.DYNAMIC).setSize(2);

            this.texture = new Texture(renderer.pass, 'u_image', 0);
      }
      protected new(): Sprite {
            this.dirty = true;
            return new Sprite();
      }  
      public update(dt: number): void {
            const entities = this.pool.stream();
            const VERTICES = 6;

            if (this.dirty) {
                  // sort
                  this.pool.sort((a,b) => b[1].img.localeCompare(a[1].img));
                  this.dirty = false;
            }

            this.program.use();
            this.renderer.projection.bind(this.program);

            let i = 0;

            while (i < entities.length) {
                  const img = entities[i][1].img;

                  if (!img) {
                        while (i < entities.length && img == entities[i][1].img) {
                              i++;
                        }
                        continue;
                  }

                  const coords: number[] = [];
                  const texCoords: number[] = [];
                  const indices: number[] = [];
                  const rotations: number[] = [];
                  const texture = this.renderer.images.get(img);

                  while (i < entities.length && img == entities[i][1].img) {
                        const pos = this.positions.getOrCreate(entities[i][0]);
                        indices.push(
                              0.0,                                      0.0,
                              texture.width * entities[i][1].scaleX,    0.0,
                              0.0,                                      texture.height * entities[i][1].scaleY,
                              0.0,                                      texture.height * entities[i][1].scaleY,
                              texture.width * entities[i][1].scaleX,    0.0,
                              texture.width * entities[i][1].scaleX,    texture.height * entities[i][1].scaleY
                        );

                        texCoords.push(
                              entities[i][1].startFrameX, entities[i][1].startFrameY,
                              entities[i][1].endFrameX  , entities[i][1].startFrameY,
                              entities[i][1].startFrameX, entities[i][1].endFrameY  ,
                              entities[i][1].startFrameX, entities[i][1].endFrameY  ,
                              entities[i][1].endFrameX  , entities[i][1].startFrameY,
                              entities[i][1].endFrameX  , entities[i][1].endFrameY  ,
                        );

                        for (let j = 0; j < VERTICES; j++) {
                              rotations.push(0, 0, entities[i][1].rotation);
                        }
                        for (let j = 0; j < VERTICES; j++) {
                              coords.push(pos.x, pos.y, -pos.z);
                        }
                        i++;
                  }

                  this.texture.use(texture);
                  this.texture.bind(this.program);

                  this.indices.write(new Float32Array(indices), GLType.FLOAT);
                  this.rotations.write(new Float32Array(rotations), GLType.FLOAT);
                  this.translation.write(new Float32Array(coords), GLType.FLOAT);
                  this.textureCoords.write(new Float32Array(texCoords), GLType.FLOAT);

                  this.indices.bind(this.program);
                  this.rotations.bind(this.program);
                  this.translation.bind(this.program);
                  this.textureCoords.bind(this.program);

                  this.renderer.pass.draw(Primitives.TRIANGLES, coords.length/3);
            }
      }
}