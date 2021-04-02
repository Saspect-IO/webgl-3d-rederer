import ShaderProgram from "./shaderProgram";

class GridAxisShader extends ShaderProgram{
	constructor(gl: WebGLRenderingContext, pMatrix: Float32Array){



		const vertSrc =
			'attribute vec3 grid_position;' +
			'attribute float grid_color;' +
			'uniform mat4 uPMatrix;' +
			'uniform mat4 uMVMatrix;' +
			'uniform mat4 uCameraMatrix;' +
			'uniform vec3 uColor[4];' +
			'varying vec4 v_color;' +
			'void main(void){' +
				'v_color = vec4(uColor[ int(grid_color) ],1.0);' +
				'gl_Position = uPMatrix * uCameraMatrix * uMVMatrix * vec4(grid_position, 1.0);' +
			'}';
		const fragSrc =
			'precision mediump float;' +
			'varying vec4 v_color;' +
			'void main(void){ gl_FragColor = v_color; }';

		super(gl,vertSrc,fragSrc);

		//Standrd Uniforms
		this.setPerspective(pMatrix);

		//Custom Uniforms 
		this.gridIndex = gl.getAttribLocation(this.shaderProgram as WebGLProgram , 'grid_position');
		this.colorIndex = gl.getAttribLocation(this.shaderProgram as WebGLProgram , 'grid_color');

		var uColor	= gl.getUniformLocation(this.shaderProgram as WebGLProgram ,"uColor");
		gl.uniform3fv(uColor, new Float32Array([ 0.8,0.8,0.8,  1,0,0,  0,1,0,  0,0,1 ]));

		//Cleanup
		gl.useProgram(null);
	}


}

export {
    GridAxisShader
}