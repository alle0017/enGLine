import { RenderPass } from "./render_pass.js";


export class Program {
      public readonly program: WebGLProgram;

      private readonly attributes: Map<string, number> = new Map;
      private readonly uniformInfos: Map<string, WebGLActiveInfo> = new Map;
      private readonly uniforms: Map<string, WebGLUniformLocation> = new Map;

      constructor(public readonly pass: RenderPass, vertex: string, fragment: string) {
            const gl = pass.ctx;
            const program = gl.createProgram();
            const vs = this.compileShader(vertex, gl.VERTEX_SHADER);
            const fs = this.compileShader(fragment, gl.FRAGMENT_SHADER);

            gl.attachShader(program, vs);
            gl.attachShader(program, fs);

            gl.linkProgram(program);

            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                  throw new Error(`Error linking shader program: ${gl.getProgramInfoLog(program)}`);
            }
            this.program = program; 
            
            const numUniforms: number = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

            for (let i = 0; i < numUniforms; i++) {
                  const uniformInfo = gl.getActiveUniform(program, i);
                  if (!uniformInfo) {
                        break;
                  }
                  this.uniformInfos.set(uniformInfo.name, uniformInfo);
            }
      }     

      private compileShader(code: string, shaderType: number) {
            const gl = this.pass.ctx;
            const shader = gl.createShader(shaderType);

            if (!shader) {
                  throw new Error(`impossible to create a shader of specified type ${shaderType == gl.VERTEX_SHADER ? 'vertex': 'fragment'}`)
            }
            gl.shaderSource(shader, code);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                  const msg = gl.getShaderInfoLog(shader);
                  throw new Error(`Error while compiling shader: obtained error ${msg}`);
            }
            return shader;
      }

      public use() {
            this.pass.ctx.useProgram(this.program);
      }

      public getUniformInfo(name: string) {
            return this.uniformInfos.get(name)!;
      }

      public getVertexAttributeLocation(name: string) {
            if (this.attributes.has(name)) {
                  return this.attributes.get(name)!;
            }

            const ptr = this.pass.ctx.getAttribLocation(this.program, name);

            if (ptr >= 0) {
                  this.attributes.set(name, ptr);
                  return ptr;
            }
            throw new Error(`invalid vertex location ${name}`);
      }

      public getUniformLocation(name: string) {
            if (this.uniforms.has(name)) {
                  return this.uniforms.get(name)!;
            }

            const ptr = this.pass.ctx.getUniformLocation(this.program, name);

            if (ptr) {
                  this.uniforms.set(name, ptr);
                  return ptr;
            }
            throw new Error(`invalid uniform location ${name}`);
      }
}