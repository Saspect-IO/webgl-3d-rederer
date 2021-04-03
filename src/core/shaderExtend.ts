import ShaderProgram from "./shaderProgram";

class GridAxisShader extends ShaderProgram{
	constructor(gl: WebGLRenderingContext, projectionMatrix: Float32Array){
				
		const vertexShader =
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
		const fragmentShader =
			'precision mediump float;' +
			'varying vec4 v_color;' +
			'void main(void){ gl_FragColor = v_color; }';

		super(gl,vertexShader, fragmentShader);

		//Custom Uniforms 
		this.gridIndex = gl.getAttribLocation(this.shaderProgram as WebGLProgram , 'grid_position');
		this.colorIndex = gl.getAttribLocation(this.shaderProgram as WebGLProgram , 'grid_color');
		this.projectionMatrix = projectionMatrix;

	}

	projectionMatrix:Float32Array;

	setGridMatrix() {
		//Standrd Uniforms
		this.setPerspective(this.projectionMatrix);
		const gl = this.gl as WebGLRenderingContext;
		const uColor = gl.getUniformLocation(this.shaderProgram as WebGLProgram ,"uColor");
		gl.uniform3fv(uColor, new Float32Array([ 0.8,0.8,0.8,  1,0,0,  0,1,0,  0,0,1 ]));

		return this;
	}

}

export {
    GridAxisShader
}