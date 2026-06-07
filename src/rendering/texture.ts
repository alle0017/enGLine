import { Program } from "./program.js";
import { RenderPass } from "./render_pass.js";

export class Texture {
      private readonly texture: WebGLTexture;

      constructor(private readonly pass: RenderPass, private readonly name: string, private readonly textureUnit: number) {
            const gl = this.pass.ctx;
            this.texture = gl.createTexture();
            if (!this.texture) {
                  throw new Error('Failed to create WebGL texture');
            }
      }
      private static isPowerOfTwo(v: number) { 
            return (v & (v - 1)) === 0; 
      }
      public use(image: HTMLImageElement) {
            const gl = this.pass.ctx;

            gl.activeTexture(gl.TEXTURE0 + this.textureUnit);
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            
            if (Texture.isPowerOfTwo(image.width) && Texture.isPowerOfTwo(image.height)) {
                  gl.generateMipmap(gl.TEXTURE_2D);
            }
            return this;
      }

      public bind(program: Program) {
            const gl = this.pass.ctx;
            const ptr = program.getUniformLocation(this.name);
            gl.activeTexture(gl.TEXTURE0 + this.textureUnit);
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.uniform1i(ptr, this.textureUnit);
      }
}