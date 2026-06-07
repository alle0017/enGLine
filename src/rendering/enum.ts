export enum Binding {

      /**
       * The data store contents will be modified once and used at most a few times.
       */
      STREAM,
      /**
       * The data store contents will be modified once and used many times.
       */
      STATIC,
      
      /**
       * The data store contents will be modified repeatedly and used many times.
       */
      DYNAMIC
};

export function toGlBinding(gl: WebGLRenderingContext, binding: Binding) {
      switch (binding) {
            case Binding.STREAM:  return gl.STREAM_DRAW;
            case Binding.STATIC:  return gl.STATIC_DRAW;
            case Binding.DYNAMIC: return gl.DYNAMIC_DRAW;
      }
      return gl.DYNAMIC_DRAW;
}

// Covers all numeric / data-related WebGL constants commonly used with:
// - vertexAttribPointer
// - texImage2D / texSubImage2D
// - renderbuffers
// - readPixels
// - uniforms
// - indices
//
// Includes both WebGL1 and WebGL2 types where applicable.

export enum GLType {
      BYTE = "BYTE",
      UNSIGNED_BYTE = "UNSIGNED_BYTE",
      SHORT = "SHORT",
      UNSIGNED_SHORT = "UNSIGNED_SHORT",
      INT = "INT",
      UNSIGNED_INT = "UNSIGNED_INT",
      FLOAT = "FLOAT",
      HALF_FLOAT = "HALF_FLOAT",

      // Packed / special pixel formats
      UNSIGNED_SHORT_4_4_4_4 = "UNSIGNED_SHORT_4_4_4_4",
      UNSIGNED_SHORT_5_5_5_1 = "UNSIGNED_SHORT_5_5_5_1",
      UNSIGNED_SHORT_5_6_5 = "UNSIGNED_SHORT_5_6_5",

      // WebGL2 packed formats
      UNSIGNED_INT_2_10_10_10_REV = "UNSIGNED_INT_2_10_10_10_REV",
      UNSIGNED_INT_10F_11F_11F_REV = "UNSIGNED_INT_10F_11F_11F_REV",
      UNSIGNED_INT_5_9_9_9_REV = "UNSIGNED_INT_5_9_9_9_REV",
      FLOAT_32_UNSIGNED_INT_24_8_REV = "FLOAT_32_UNSIGNED_INT_24_8_REV",
      UNSIGNED_INT_24_8 = "UNSIGNED_INT_24_8",

      // Sampler / depth related
      DEPTH_COMPONENT = "DEPTH_COMPONENT",
      DEPTH_STENCIL = "DEPTH_STENCIL",
}

/**
 * Returns the actual numeric WebGL constant.
 */
export function toGLType(gl: WebGLRenderingContext, type: GLType) {
      switch (type) {
            case GLType.BYTE:
                  return gl.BYTE;

            case GLType.UNSIGNED_BYTE:
                  return gl.UNSIGNED_BYTE;

            case GLType.SHORT:
                  return gl.SHORT;

            case GLType.UNSIGNED_SHORT:
                  return gl.UNSIGNED_SHORT;

            case GLType.INT:
                  return (gl as WebGL2RenderingContext).INT;

            case GLType.UNSIGNED_INT:
                  return gl.UNSIGNED_INT;

            case GLType.FLOAT:
                  return gl.FLOAT;

            case GLType.HALF_FLOAT:
                  return (gl as WebGL2RenderingContext).HALF_FLOAT;

            case GLType.UNSIGNED_SHORT_4_4_4_4:
                  return gl.UNSIGNED_SHORT_4_4_4_4;

            case GLType.UNSIGNED_SHORT_5_5_5_1:
                  return gl.UNSIGNED_SHORT_5_5_5_1;

            case GLType.UNSIGNED_SHORT_5_6_5:
                  return gl.UNSIGNED_SHORT_5_6_5;

            case GLType.UNSIGNED_INT_2_10_10_10_REV:
                  return (gl as WebGL2RenderingContext).UNSIGNED_INT_2_10_10_10_REV;

            case GLType.UNSIGNED_INT_10F_11F_11F_REV:
                  return (gl as WebGL2RenderingContext)
                  .UNSIGNED_INT_10F_11F_11F_REV;

            case GLType.UNSIGNED_INT_5_9_9_9_REV:
                  return (gl as WebGL2RenderingContext).UNSIGNED_INT_5_9_9_9_REV;

            case GLType.FLOAT_32_UNSIGNED_INT_24_8_REV:
                  return (gl as WebGL2RenderingContext)
                  .FLOAT_32_UNSIGNED_INT_24_8_REV;

            case GLType.UNSIGNED_INT_24_8:
                  return (gl as WebGL2RenderingContext).UNSIGNED_INT_24_8;

            case GLType.DEPTH_COMPONENT:
                  return gl.DEPTH_COMPONENT;

            case GLType.DEPTH_STENCIL:
                  return gl.DEPTH_STENCIL;

            default:
                  throw new Error(`Unsupported GL type: ${type}`);
      }
}

export enum Primitives {
      POINTS,
      LINES,
      LINE_LOOP,
      LINE_STRIP,
      TRIANGLES,
      TRIANGLE_STRIP,
      TRIANGLE_FAN,
};

export function toGLPrimitive(gl: WebGLRenderingContext, type: Primitives) {
      switch (type) {
            case Primitives.POINTS: return gl.POINTS;
            case Primitives.LINES: return gl.LINES;
            case Primitives.LINE_LOOP: return gl.LINE_LOOP;
            case Primitives.LINE_STRIP: return gl.LINE_STRIP;
            case Primitives.TRIANGLES: return gl.TRIANGLES;
            case Primitives.TRIANGLE_STRIP: return gl.TRIANGLE_STRIP;
            case Primitives.TRIANGLE_FAN: return gl.TRIANGLE_FAN;
      }
}

export enum BufferType {
      VERTEX,
      INDEX
}

export function toGLBufferType(gl: WebGLRenderingContext, type: BufferType) {
      switch (type) {
            case BufferType.VERTEX: return gl.ARRAY_BUFFER
            case BufferType.INDEX: return gl.ELEMENT_ARRAY_BUFFER
      }
}