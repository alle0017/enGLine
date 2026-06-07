import { RenderPass } from "./render_pass.js";
import { Program } from './program.js';

export class UniformBuffer {

      constructor(
            private readonly pass: RenderPass, 
            private readonly name: string
      ) {}

      public bind(program: Program, value: number | number[]) {
            this.pass.uniformManager.write(program, this.name, value);
      }
}