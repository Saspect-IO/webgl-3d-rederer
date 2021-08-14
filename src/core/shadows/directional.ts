import ShaderProgram from '../shaderProgram';
import { GLSetttings } from "@/modules";
import Geometry from '../geometry';
import DepthTexture from '../Textures/depthTexture';
import ObjLoader from '../objLoader';
import { MeshData } from '@/entities';
import Vbuffer from '../vbuffer';
import { Camera } from '../camera';


class DirectionalShadowShader {
	constructor(gl: WebGLRenderingContext, camera: Camera) {
		const vertexShader = `#version 300 es
			layout(location=8) in vec3 a_position;

			uniform mat4 u_mVMatrix;
			uniform mat4 u_cameraViewMatrix;
			uniform mat4 u_oMatrix;

			mat4 m_worldMatrix;
			mat4 m_viewProjectionMatrix;
			mat4 m_worldViewProjectionMatrix;

			void main(void){

				m_worldMatrix = u_mVMatrix;
				m_viewProjectionMatrix = u_oMatrix * u_cameraViewMatrix;
				m_worldViewProjectionMatrix = m_viewProjectionMatrix * m_worldMatrix;

				gl_Position = m_worldViewProjectionMatrix * vec4(a_position, 1.0);
			}`;

		const fragmentShader = `#version 300 es
			precision mediump float;
			uniform vec4 u_color;

			out vec4 finalColor;

			void main(void) {
				finalColor = u_color;
			}`;

		
		const shaderProgram = new ShaderProgram(gl,vertexShader, fragmentShader)

		shaderProgram.activateShader()

		this.positionLoc = gl.getAttribLocation(shaderProgram.program  as WebGLProgram, GLSetttings.ATTR_POSITION_NAME)
		
		this.modelViewMatrixLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_MODEL_MAT) as WebGLUniformLocation
		this.orthoMatrixLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_ORTHO_MAT) as WebGLUniformLocation
        this.cameraMatrixLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_CAMERA_MAT) as WebGLUniformLocation
		this.uColorLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_COLOR) as WebGLUniformLocation

		this.orthoProjectionMatrix = camera.orthoProjection
		this.viewModelMatrix = camera.viewMatrix
		this.shaderProgram = shaderProgram

		shaderProgram.deactivateShader()
	}

	positionLoc: number
	shaderProgram: ShaderProgram

	modelViewMatrixLoc: WebGLUniformLocation
	orthoMatrixLoc: WebGLUniformLocation
	cameraMatrixLoc: WebGLUniformLocation
	uColorLoc: WebGLUniformLocation

	orthoProjectionMatrix:Float32Array
	viewModelMatrix:Float32Array

	setUniforms(gl:WebGLRenderingContext, model: Geometry) {
		this.shaderProgram.activateShader()
        gl.uniformMatrix4fv(this.orthoMatrixLoc , false, this.orthoProjectionMatrix)
		gl.uniformMatrix4fv(this.cameraMatrixLoc , false, this.viewModelMatrix)
		gl.uniformMatrix4fv(this.modelViewMatrixLoc, false, model.transform.getModelMatrix())
		gl.uniform4fv(this.uColorLoc, new Float32Array([0.0, 0.0, 0.0, 1.0]))

		return this
    }
}


class DirectionalShadow {

	constructor() {}

	static createGeometry(gl: WebGLRenderingContext, shaderProgram: DirectionalShadowShader, vertices: ObjLoader) {
		return new Geometry(DirectionalShadow.createMesh(gl, shaderProgram, vertices));
	}

	static createMesh(gl: WebGLRenderingContext, shaderProgram: DirectionalShadowShader, vertices: ObjLoader) {

		const vertexCount = vertices.vertexCount();

		const mesh: MeshData = {
			positions: new Vbuffer(gl, vertices.positions(), vertexCount, GLSetttings.BUFFER_TYPE_ARRAY),
			drawMode: gl.TRIANGLES,
			vertexCount,
		}

		mesh.positions?.bindToAttribute(shaderProgram.positionLoc as number, GLSetttings.DEFAULT_STRIDE, GLSetttings.DEFAULT_OFFSET);

		return mesh;
	}
}


export {
	DirectionalShadowShader,
	DirectionalShadow
}