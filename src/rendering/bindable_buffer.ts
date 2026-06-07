import { Binding, GLType, toGlBinding, toGLType, BufferType, toGLBufferType } from "./enum.js";
import { RenderPass } from "./render_pass.js";
import { Program } from './program.js';

export abstract class BindableBuffer {
      protected readonly buffer: WebGLBuffer;
      protected normalized: boolean = false;
      protected type: GLType = GLType.FLOAT;
      protected offset: number = 0;
      protected stride: number = 0;
      protected size: number = 0;
      protected readonly bufferType: number;
      protected readonly bufferChangeRate: number;

      constructor(
            protected readonly pass: RenderPass, 
            protected readonly name: string, 
            bufferChangeRate: Binding,
            bufferType: BufferType
      ) {
            this.buffer = pass.ctx.createBuffer();
            this.bufferType = toGLBufferType(pass.ctx, bufferType);
            this.bufferChangeRate = toGlBinding(pass.ctx, bufferChangeRate);
      }

      public write(array: AllowSharedBufferSource, type: GLType) {
            const gl = this.pass.ctx;
            const glBindingType = this.bufferChangeRate; // static, dynamic, stream

            this.type = type;

            gl.bindBuffer(this.bufferType, this.buffer);
            gl.bufferData(this.bufferType, array, glBindingType);
      }

      public writePartial(array: AllowSharedBufferSource, offset: number) {
            const gl = this.pass.ctx;

            gl.bindBuffer(this.bufferType, this.buffer);
            gl.bufferSubData(this.bufferType, offset, array);
      }

      public setOffset(x: number): this {
            this.offset = x;
            return this;
      }

      public setStride(x: number): this {
            this.stride = x;
            return this;
      }

      public normalize(v: boolean): this {
            this.normalized = v;
            return this;
      }

      public setSize(size: number): this {
            this.size = size;
            return this;
      }

      public abstract bind(program: Program): void;
      public getType(): GLType {
            return this.type;
      }
}