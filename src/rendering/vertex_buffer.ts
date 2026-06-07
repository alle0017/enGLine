import { Binding, BufferType, toGLType } from "./enum.js";
import { RenderPass } from "./render_pass.js";
import { BindableBuffer } from "./bindable_buffer.js";
import { Program } from "./program.js";

export class VertexBuffer extends BindableBuffer {
      constructor(
            pass: RenderPass, 
            name: string, 
            bufferChangeRate: Binding
      ) {
            super(pass, name, bufferChangeRate, BufferType.VERTEX)
      }

      public override bind(program: Program): void {
            const gl = this.pass.ctx;
            const ptr = program.getVertexAttributeLocation(this.name);

            gl.enableVertexAttribArray(ptr);
            gl.bindBuffer(this.bufferType, this.buffer);
            gl.vertexAttribPointer(ptr, this.size, toGLType(gl, this.type), this.normalized, this.stride, this.offset)
      }
}