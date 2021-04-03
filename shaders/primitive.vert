attribute vec3 grid_position;
attribute float grid_color;

uniform mat4 uPMatrix;
uniform mat4 uMVMatrix;
uniform mat4 uCameraMatrix;
uniform vec3 uColor[4];
varying vec4 v_color;

void main(void){
	v_color = vec4(uColor[ int(grid_color) ],1.0);
	gl_Position = uPMatrix * uCameraMatrix * uMVMatrix * vec4(grid_position, 1.0);
};