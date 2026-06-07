import { Program } from "./program.js";

type UniformSetter = (location: WebGLUniformLocation, value: unknown) => void;
export function getUniformSetter(gl: WebGLRenderingContext): Record<number, UniformSetter> {
      return {
            [gl.FLOAT]: (location: WebGLUniformLocation, value: unknown) => gl.uniform1f(location, value as number),
            [gl.FLOAT_VEC2]: (location: WebGLUniformLocation, value: unknown) => gl.uniform2fv(location, value as number[]),
            [gl.FLOAT_VEC3]: (location: WebGLUniformLocation, value: unknown) => gl.uniform3fv(location, value as number[]),
            [gl.FLOAT_VEC4]: (location: WebGLUniformLocation, value: unknown) => gl.uniform4fv(location, value as number[]),
            [gl.INT]: (location: WebGLUniformLocation, value: unknown) => gl.uniform1i(location, value as number),
            [gl.INT_VEC2]: (location: WebGLUniformLocation, value: unknown) => gl.uniform2iv(location, value as number[]),
            [gl.INT_VEC3]: (location: WebGLUniformLocation, value: unknown) => gl.uniform3iv(location, value as number[]),
            [gl.INT_VEC4]: (location: WebGLUniformLocation, value: unknown) => gl.uniform4iv(location, value as number[]),
            [gl.BOOL]: (location: WebGLUniformLocation, value: unknown) => gl.uniform1iv(location, value as number[]),
            [gl.BOOL_VEC2]: (location: WebGLUniformLocation, value: unknown) => gl.uniform2iv(location, value as number[]),
            [gl.BOOL_VEC3]: (location: WebGLUniformLocation, value: unknown) => gl.uniform3iv(location, value as number[]),
            [gl.BOOL_VEC4]: (location: WebGLUniformLocation, value: unknown) => gl.uniform4iv(location, value as number[]),
            [gl.FLOAT_MAT2]: (location: WebGLUniformLocation, value: unknown) => gl.uniformMatrix2fv(location, false, value as number[]),
            [gl.FLOAT_MAT3]: (location: WebGLUniformLocation, value: unknown) => gl.uniformMatrix3fv(location, false, value as number[]),
            [gl.FLOAT_MAT4]: (location: WebGLUniformLocation, value: unknown) => gl.uniformMatrix4fv(location, false, value as number[]),
      };
}

export function getVectorialUniformSetter(gl: WebGLRenderingContext): Record<number, UniformSetter> {
      return {
            [gl.FLOAT]: (location: WebGLUniformLocation, value: unknown) => gl.uniform1fv(location, value as number[]),
            [gl.INT]: (location: WebGLUniformLocation, value: unknown) => gl.uniform1iv(location, value as number[]),
      }
}

export class UniformSetterManager {
      private readonly setter: Record<number, UniformSetter>;

      constructor(private readonly gl: WebGLRenderingContext) {
            this.setter = getUniformSetter(gl);
      }

      public write(program: Program, name: string, value: unknown) {
            const info = program.getUniformInfo(name);
            const location = program.getUniformLocation(name);

            this.setter[info.type](location, value);
      }     
}