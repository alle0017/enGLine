export const VERTEX = /*glsl*/`
attribute vec2 a_position;

attribute vec2 a_texCoord;
attribute vec3 a_rotations;
attribute vec3 a_translation;

uniform mat4 u_projection;

varying vec2 v_texCoord;

void main() {
      
      mat4 rotate_z = mat4(
            cos(a_rotations.z),  sin(a_rotations.z), 0, 0,
            -sin(a_rotations.z),  cos(a_rotations.z), 0, 0,
            0,        0,     1, 0,
            0,        0,     0, 1
      );
      mat4 translate = mat4(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            a_translation.x, a_translation.y, a_translation.z, 1
      );
      mat4 transform = rotate_z * translate;
      vec4 world = transform * vec4(a_position, 0, 1);
      vec4 screen = u_projection * world;

      gl_Position = screen;
      v_texCoord = a_texCoord;
}
`

export const FRAGMENT = /*glsl*/`
precision mediump float;

uniform sampler2D u_image;

varying vec2 v_texCoord;

void main() {
      vec4 color = texture2D(u_image, v_texCoord);
      if (color.a < 0.01) {
            discard;
      } 
      gl_FragColor = color;
}
`