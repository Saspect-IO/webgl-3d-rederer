import ShaderProgram from "./shaderProgram";

class GridAxisShader extends ShaderProgram{
	constructor(gl: WebGLRenderingContext, projectionMatrix: Float32Array){
			
		const vertexShader  = '#version 300 es\n' +
			'in vec3 a_position;' +
			'layout(location=4) in float a_color;' +
			'uniform mat4 uPMatrix;' +
			'uniform mat4 uMVMatrix;' +
			'uniform mat4 uCameraMatrix;' +
			'uniform vec3 uColor[4];' +
			'out lowp vec4 color;' +
			'void main(void){' +
				'color = vec4(uColor[ int(a_color) ],1.0);' +
				'gl_Position = uPMatrix * uCameraMatrix * uMVMatrix * vec4(a_position, 1.0);' +
			'}';
		const fragmentShader = '#version 300 es\n' +
			'precision mediump float;' +
			'in vec4 color;' +
			'out vec4 finalColor;' +
			'void main(void){ finalColor = color; }';

		super(gl,vertexShader, fragmentShader);

		//Custom Uniforms 

		this.setPerspective(projectionMatrix);
		const uColor = gl.getUniformLocation(this.shaderProgram as WebGLProgram ,"uColor");
		gl.uniform3fv(uColor, new Float32Array([ 0.8,0.8,0.8,  1,0,0,  0,1,0,  0,0,1 ]));

		//Cleanup
		gl.useProgram(null);

	}
}

class ModelShader extends ShaderProgram{
	constructor(gl: WebGLRenderingContext, projectionMatrix: Float32Array){	
		const vertexShader = '#version 300 es\n' +
			'in vec3 a_position;'+
			'in vec3 a_norm;'+
			'in vec2 a_uv;'+

			'uniform mat4 uMVMatrix;'+
			'uniform mat4 uCameraMatrix;'+
			'uniform mat4 uPMatrix;'+

			'out vec3 vNormal;'+
			'out highp vec2 texCoord;'+
			'void main(void){' +
				'texCoord = a_uv;'+
				'vNormal = (uMVMatrix * vec4(a_norm, 0.)).xyz;'+
				'gl_Position = uPMatrix * uCameraMatrix * uMVMatrix * vec4(a_position, 1.0);'+
			'}';

		const fragmentShader = '#version 300 es\n' +
			'precision mediump float;'+

			'uniform vec3 lightDirection;'+
			'uniform float ambientLight;'+
			'uniform sampler2D diffuse;'+

			'in vec3 vNormal;'+
			'in highp vec2 texCoord;'+

			'out vec4 finalColor;'+
			'void main(void) {'+
				'float lightness = -clamp(dot(normalize(vNormal), normalize(lightDirection)), -1.0, 0.0);'+
				'lightness = ambientLight + (1.0 - ambientLight) * lightness;'+
				'finalColor = texture(uMainTex, vec2(texCoord.s, texCoord.t) * lightness, 1.0);'+
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