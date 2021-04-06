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

		this.setPerspective(projectionMatrix);
		const uColor = gl.getUniformLocation(this.shaderProgram as WebGLProgram ,"uColor");
		gl.uniform3fv(uColor, new Float32Array([ 0.8,0.8,0.8,  1,0,0,  0,1,0,  0,0,1 ]));

		//Cleanup
		gl.useProgram(null);

	}
}

class ModelShader extends ShaderProgram{
	constructor(gl: WebGLRenderingContext, projectionMatrix: Float32Array){	
		const vertexShader =
			'attribute vec3 a_position;'+
			'attribute vec3 a_norm;'+
			'attribute vec2 a_uv;'+
			'uniform mat4 uMVMatrix;'+
			'uniform mat4 uCameraMatrix;'+
			'uniform mat4 uPMatrix;'+
			'varying vec3 vNormal;'+
			'varying vec2 vUv;'+
			'void main(){' +
				'vUv = a_uv;'+
				'vNormal = (uMVMatrix * vec4(a_norm, 0.)).xyz;'+
				'gl_Position = uPMatrix * uCameraMatrix * uMVMatrix * vec4(a_position, 1.0);'+
			'}';

		const fragmentShader =
			'precision highp float;'+
			'uniform vec3 lightDirection;'+
			'uniform float ambientLight;'+
			'uniform sampler2D diffuse;'+
			'varying vec3 vNormal;'+
			'varying vec2 vUv;'+
			'void main() {'+
				'float lightness = -clamp(dot(normalize(vNormal), normalize(lightDirection)), -1.0, 0.0);'+
				'lightness = ambientLight + (1.0 - ambientLight) * lightness;'+
				'gl_FragColor = vec4(texture2D(diffuse, vUv).rgb * lightness, 1.0);'+
			'}';												

		super(gl,vertexShader, fragmentShader);

		//Custom Uniforms 
		this.positionIndex = gl.getAttribLocation(this.shaderProgram as WebGLProgram , 'a_position');
		this.normalIndex = gl.getAttribLocation(this.shaderProgram as WebGLProgram , 'a_norm');
		this.uvIndex = gl.getAttribLocation(this.shaderProgram as WebGLProgram , 'a_uv');
	
		
		// this.mainTexture = gl.getUniformLocation(this.shaderProgram as WebGLProgram , 'uMainTexture') as WebGLUniformLocation;
	
		// this.ambientLight = gl.getUniformLocation(this.shaderProgram as WebGLProgram , 'ambientLight') as WebGLUniformLocation;
		// this.lightDirection = gl.getUniformLocation(this.shaderProgram as WebGLProgram , 'lightDirection') as WebGLUniformLocation;
		this.setPerspective(projectionMatrix);

		//Cleanup
		gl.useProgram(null);
	}
}

export {
    GridAxisShader,
	ModelShader
}