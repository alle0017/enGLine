import { Binding, BufferType, toGLType } from "./enum.js";
import { RenderPass } from "./render_pass.js";
import { BindableBuffer } from "./bindable_buffer.js";
import { Program } from "./program.js";

export class VertexBuffer extends BindableBuffer {
      private readonly map: WeakMap<Program,number> = new WeakMap;
      constructor(
            pass: RenderPass, 
            name: string, 
            bufferChangeRate: Binding
      ) {
            super(pass, name, bufferChangeRate, BufferType.VERTEX)
      }

      public override bind(program: Program): void {
            const gl = this.pass.ctx;
            let ptr: number;

            if (!this.map.has(program)) {
                  ptr = program.getVertexAttributeLocation(this.name);
      
                  gl.enableVertexAttribArray(ptr);
                  this.map.set(program, ptr);
            } else {
                  ptr = this.map.get(program)!;
            }
            gl.bindBuffer(this.bufferType, this.buffer);
            gl.vertexAttribPointer(ptr, this.size, toGLType(gl, this.type), this.normalized, this.stride, this.offset)
      }
}