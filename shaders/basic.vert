attribute vec3 a_position;
attribute vec3 normal;
attribute vec2 uv;
uniform mat4 uMVMatrix;
uniform mat4 uCameraMatrix;
uniform mat4 uPMatrix;
varying vec3 vNormal;
varying vec2 vUv;

void main() {
    vUv = uv;
    vNormal = (uMVMatrix * vec4(normal, 0.)).xyz;
    gl_Position = uPMatrix * uCameraMatrix * uMVMatrix * vec4(a_position, 1.);
}
