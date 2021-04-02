import ShaderProgram from "./shaderProgram";

class GridAxisShader extends ShaderProgram{
	constructor(gl: WebGLRenderingContext, pMatrix: Float32Array){
		const vertSrc =
			'attribute vec3 a_position;' +
			'varying float a_color;' +
			'uniform mat4 uPMatrix;' +
			'uniform mat4 uMVMatrix;' +
			'uniform mat4 uCameraMatrix;' +
			'uniform vec3 uColor[4];' +
			'varying vec4 color;' +
			'void main(void){' +
				'color = vec4(uColor[ int(a_color) ],1.0);' +
				'gl_Position = uPMatrix * uCameraMatrix * uMVMatrix * vec4(a_position, 1.0);' +
			'}';
		const fragSrc =
			'precision mediump float;' +
			'varying vec4 color;' +
			'void main(void){ gl_FragColor = color; }';

		super(gl,vertSrc,fragSrc);

		//Standrd Uniforms
		this.setPerspective(pMatrix);

		//Custom Uniforms 
		var uColor	= gl.getUniformLocation(this.shaderProgram as WebGLProgram ,"uColor");
		gl.uniform3fv(uColor, new Float32Array([ 0.8,0.8,0.8,  1,0,0,  0,1,0,  0,0,1 ]));

		//Cleanup
		gl.useProgram(null);
	}
}

export {
    GridAxisShader
}