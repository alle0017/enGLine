import { Primitives, toGLPrimitive, toGLType  } from "./enum.js";
import { IndexBuffer } from "./index_buffer.js";
import { UniformSetterManager } from "./uniform_setter_map.js";

export class RenderPass {
      public readonly ctx: WebGLRenderingContext;
      public readonly uniformManager: UniformSetterManager;

      constructor(cvs: HTMLCanvasElement) {
            const ctx = cvs.getContext('webgl');

            if (!ctx) {
                  throw new Error('impossible to retrieve the webgl context');
            }
            this.ctx = ctx;
            this.ctx.viewport(0, 0, cvs.width, cvs.height);
            this.ctx.clearColor(0.8, 0.9, 1.0, 1.0);
            this.ctx.clear(this.ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);
            ctx.enable(ctx.DEPTH_TEST);
            ctx.depthFunc(ctx.LEQUAL);
            window.addEventListener('resize', () => {
                  this.ctx.viewport(0, 0, cvs.width, cvs.height);
            });
            this.uniformManager = new UniformSetterManager(this.ctx);
      }
      
      public decorate(func: (ctx: WebGLRenderingContext) => void): this {
            func(this.ctx);
            return this;
      }
      public draw(primitive: Primitives, vertexCount: number, offset: number = 0) {
            this.ctx.drawArrays(toGLPrimitive(this.ctx, primitive), offset, vertexCount);
      }
      public drawIndexed(buffer: IndexBuffer, primitive: Primitives, vertexCount: number, offset: number = 0) {
            buffer.bind();
            this.ctx.drawElements(toGLPrimitive(this.ctx, primitive), offset, toGLType(this.ctx, buffer.getType()), vertexCount)
      }
}