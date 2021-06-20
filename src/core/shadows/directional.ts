import ShaderProgram from '../shaderProgram';
import { GLSetttings, ShaderProgramMatrixFields } from "@/modules";


export class DirectionalShadowShader extends ShaderProgram{
	constructor(gl: WebGLRenderingContext, projectionMatrix: Float32Array){	
		const vertexShader = '#version 300 es\n' +
			'in vec3 a_position;'+

			'uniform mat4 u_mVMatrix;'+	
			'uniform mat4 u_cameraMatrix;'+
			'uniform mat4 u_oMatrix;'+

			'mat4 m_worldMatrix;'+
			'mat4 m_viewProjectionMatrix;'+
			'mat4 m_worldViewProjectionMatrix;'+

			'void main(void){' +

				'm_worldMatrix = u_mVMatrix;'+
				'm_viewProjectionMatrix = u_oMatrix * u_cameraMatrix;'+
				'm_worldViewProjectionMatrix = m_viewProjectionMatrix * m_worldMatrix;'+

				'gl_Position = m_worldViewProjectionMatrix * vec4(a_position, 1.0);'+
			'}';

		const fragmentShader = '#version 300 es\n' +
			'precision mediump float;'+

			'uniform vec4 u_color;'+

			'out vec4 finalColor;'+

			'void main(void) {'+

				'finalColor = u_color;'+
				
			'}';												

		super(gl,vertexShader, fragmentShader);
		this.orthoMatrix = gl.getUniformLocation(this.shaderProgram  as WebGLProgram , GLSetttings.UNI_ORTHO_MAT) as WebGLUniformLocation
		this.textureMatrix = gl.getUniformLocation(this.shaderProgram  as WebGLProgram , GLSetttings.UNI_TEXTURE_MAT) as WebGLUniformLocation
		this.projectedTexture = gl.getUniformLocation(this.shaderProgram  as WebGLProgram , GLSetttings.UNI_ORTHO_MAT) as WebGLUniformLocation
		this.updateGPU(projectionMatrix, ShaderProgramMatrixFields.ORTHO_MATRIX);
		const uColor = gl.getUniformLocation(this.shaderProgram as WebGLProgram ,"u_color");
		gl.uniform4fv(uColor, new Float32Array( [0.0, 0.0, 0.0, 1.0]));

		//Cleanup
		this.deactivateShader();
	}
}
