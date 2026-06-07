import { Binding, BufferType, } from "./enum.js";
import { RenderPass } from "./render_pass.js";
import { BindableBuffer } from "./bindable_buffer.js";

export class IndexBuffer extends BindableBuffer {
      constructor(
            pass: RenderPass, 
            bufferChangeRate: Binding
      ) {
            super(pass, '', bufferChangeRate, BufferType.INDEX)
      }

      public override bind(): void {
            const gl = this.pass.ctx;
            gl.bindBuffer(this.bufferType, this.buffer);
      }
}