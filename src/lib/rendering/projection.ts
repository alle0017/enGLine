import type { RenderPass } from "../../rendering/render_pass";
import { UniformBuffer } from "../../rendering/uniform_buffer.js";
import type { Program } from '../../rendering/program';

export abstract class Projection {
      private readonly buffer: UniformBuffer;
      private dirty: boolean = true;

      constructor(private readonly pass: RenderPass) {
            this.buffer = new UniformBuffer(pass, 'u_projection');
      }

      protected abstract getMatrix(): number[];

      protected markDirty() {
            this.dirty = true;
      }

      public bind(program: Program) {
            if (this.dirty) {
                  this.dirty = false;
                  this.buffer.bind(program, this.getMatrix());
            }
      }
}

export class OrthogonalProjection extends Projection {
      private readonly matrix: number[];
      constructor(pass: RenderPass, width: number, height: number, near: number = 0, far: number = 1) {
            super(pass);
            const r = width;
            const l = 0;
            const t = height;
            const b = 0;
            const n = near;
            const f = far;

            this.matrix = [
                  2/(r-l), 0, 0, 0,
                  0, 2/(b-t), 0, 0,
                  0, 0, 1/(n-f), 0, 
                  (l+r)/(l-r), (t+b)/(t-b), n/(n-f), 1
            ];
      }

      protected override getMatrix(): number[] {
          return this.matrix;
      }
}

export class PerspectiveProjection extends Projection {
      private readonly matrix: number[];
      constructor(pass: RenderPass, width: number, height: number, near: number = 1, far: number = 1000) {
            super(pass);
            const r = width;
            const l = 0;
            const t = height;
            const b = 0;
            const n = near;
            const f = far;

            this.matrix = [
                  2*n/(r-l), 0, 0, 0,

                  0, 2*n/(b-t), 0, 0,

                  (r+l)/(r-l),
                  (t+b)/(b-t),
                  -(f+n)/(f-n),
                  -1,

                  0,
                  0,
                  -(2*f*n)/(f-n),
                  0,
            ];
      }

      protected override getMatrix(): number[] {
          return this.matrix;
      }
}