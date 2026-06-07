import type { Binding, GLType } from "./enum"
import type { Program } from "./program";
import type { RenderPass } from "./render_pass";
import { VertexBuffer } from './vertex_buffer.js';

export type VertexDescriptor = {
      size: number,
      type: GLType
      binding: Binding
}

export type VertexGroupDescriptor<T extends string> = Record<T,VertexDescriptor>

export class VertexGroup<T extends string> {
      private readonly buffers: Map<string, VertexBuffer> = new Map;

      constructor(private readonly pass: RenderPass, descriptor: VertexGroupDescriptor<T>) {
            const entries: [string, VertexDescriptor][] = Object.entries(descriptor);
            for (let i = 0; i < entries.length; i++) {
                  const buffer = new VertexBuffer(pass, entries[i][0], entries[i][1].binding)
                                    .setSize(entries[i][1].size)
                                    .setType(entries[i][1].type);
                  this.buffers.set(entries[i][0], buffer);
            }
      }
      public writeAndBind(program: Program, values: Record<T, AllowSharedBufferSource>) {
            const entries: [string, AllowSharedBufferSource][] = Object.entries(values);

            for (let i = 0; i < entries.length; i++) {
                  const buffer = this.buffers.get(entries[i][0])!;
                  buffer.write(entries[i][1]);
                  buffer.bind(program);
            }
      }
      public buffer(name: T): VertexBuffer {
            return this.buffers.get(name)!;
      }
}