import Geometry from './geometry'
import Texture from './Textures/texture'
import Vbuffer from './vbuffer'
import ShaderProgram from './shaderProgram'
import ObjLoader from './objLoader'
import { MeshData } from '@/entities'
import { GLSetttings } from '@/modules'
import { Camera } from './camera'
import { Matrix4 } from './math'

class ModelShader{
	constructor(gl: WebGLRenderingContext, sceneViewCamera:Camera){	
		const vertexShader = `#version 300 es
			in vec3 a_position;
			in vec3 a_norm;
			in vec2 a_texCoord;

			uniform vec3 u_lightPosition;
			uniform vec3 u_cameraPosition;

			uniform mat4 u_modelMatrix;
			uniform mat4 u_cameraViewMatrix;
			uniform mat4 u_projectionMatrix;

			out vec3 v_normal;
			out vec3 v_surfaceToLight;
			out vec3 v_surfaceToCamera;

			out vec2 v_texCoord;

			void main(void){

				gl_Position = u_projectionMatrix * u_cameraViewMatrix * u_modelMatrix * vec4(a_position, 1.0);
				v_normal = (u_cameraViewMatrix * vec4(a_norm, 0.0)).xyz;

				vec3 v_surfaceWorldPosition = (u_modelMatrix * vec4(a_position, 1.0)).xyz;
				v_surfaceToLight = u_lightPosition - v_surfaceWorldPosition;
				v_surfaceToCamera = u_cameraPosition - v_surfaceWorldPosition;

				v_texCoord = a_texCoord;

			}`;

		const fragmentShader = `#version 300 es
			precision highp float;

			in vec2 v_texCoord;
			in vec3 v_normal;
			in vec3 v_surfaceToLight;
			in vec3 v_surfaceToCamera;

			uniform sampler2D u_smapler_0;
			uniform sampler2D u_smapler_1;
			uniform sampler2D u_smapler_2;
			uniform sampler2D u_smapler_3;
			uniform sampler2D u_smapler_4;
			uniform vec4 u_lightColor;
			uniform vec4 u_ambientLightColor;
			uniform vec4 u_specularColor;
			uniform float u_shininess;
			uniform float u_specularFactor;

			out vec4 finalColor;

			void main(void) {

				vec4 texel0 = texture(u_smapler_0, v_texCoord);
				vec4 texel1 = texture(u_smapler_1, v_texCoord);
				vec4 texel2 = texture(u_smapler_2, v_texCoord);
				vec4 texel3 = texture(u_smapler_3, v_texCoord);
				vec4 c_texel =  (texel0 + texel1) * texel2 * texel3;
				vec3 normal = normalize(v_normal);

				vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
				vec3 surfaceToCameraDirection = normalize(v_surfaceToCamera);
				vec3 halfVector = normalize(surfaceToLightDirection + surfaceToCameraDirection);

				float lightIntensity = dot(normal, surfaceToLightDirection);
				float specular = 0.0;
				if (lightIntensity > 0.0) {
				  specular = pow(dot(normal, halfVector), u_shininess);
				}

				vec4 diffuse = (u_ambientLightColor + u_lightColor) * lightIntensity;
				vec4 outColor = vec4(c_texel.rgb * diffuse.xyz, c_texel.a);
				outColor.rgb += specular;

				finalColor = outColor;
			}`;											

		const shaderProgram = new ShaderProgram(gl, vertexShader, fragmentShader)

		shaderProgram.activateShader()

		this.positionLoc = gl.getAttribLocation(shaderProgram.program as WebGLProgram, GLSetttings.ATTR_POSITION_NAME)
		this.texCoordLoc = gl.getAttribLocation(shaderProgram.program as WebGLProgram, GLSetttings.ATTR_UV_NAME)
		this.normalLoc = gl.getAttribLocation(shaderProgram.program as WebGLProgram, GLSetttings.ATTR_NORMAL_NAME)

		this.modelMatrixLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_MODEL_MAT) as WebGLUniformLocation
		this.perspectiveMatrixLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_PROJECTION_MAT) as WebGLUniformLocation
		this.cameraViewMatrixLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_CAMERA_VIEW_MAT) as WebGLUniformLocation
		this.projectedTextureLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_PROJECTED_TEXTURE) as WebGLUniformLocation
		this.textureMatrixLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_TEXTURE_MAT) as WebGLUniformLocation
		
		this.ambientLightColorLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_LIGHT_AMBIENT) as WebGLUniformLocation
		this.lightPositionLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_LIGHT_POSITION) as WebGLUniformLocation
		this.cameraPositionLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_CAMERA_POSITION) as WebGLUniformLocation
		this.shininessLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_CAMERA_SHININESS) as WebGLUniformLocation
		this.lightColorLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_LIGHT_COLOR) as WebGLUniformLocation
		this.specularColorLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_SPECULAR_COLOR) as WebGLUniformLocation
		this.specularFactorLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_SPECULAR_FACTOR) as WebGLUniformLocation

		this.sampler0Loc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_SAMPLER_0) as WebGLUniformLocation
		this.sampler1Loc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_SAMPLER_1) as WebGLUniformLocation
		this.sampler2Loc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_SAMPLER_2) as WebGLUniformLocation
		this.sampler3Loc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_SAMPLER_3) as WebGLUniformLocation

		//Cleanup
		shaderProgram.deactivateShader()

		this.perspectiveProjectionMatrix = sceneViewCamera.perspectiveProjection
		this.orthoProjectionMatrix = sceneViewCamera.orthoProjection
		this.viewMatrix = sceneViewCamera.viewMatrix
		this.sceneViewCamera = sceneViewCamera
		this.shaderProgram = shaderProgram
	}

	positionLoc: number
	normalLoc: number
	texCoordLoc: number
  
	modelMatrixLoc: WebGLUniformLocation
	perspectiveMatrixLoc: WebGLUniformLocation
	cameraViewMatrixLoc: WebGLUniformLocation
	textureMatrixLoc: WebGLUniformLocation
	
	projectedTextureLoc: WebGLUniformLocation
	ambientLightColorLoc: WebGLUniformLocation
	lightPositionLoc: WebGLUniformLocation
	cameraPositionLoc: WebGLUniformLocation
	shininessLoc: WebGLUniformLocation
	lightColorLoc: WebGLUniformLocation
	specularColorLoc: WebGLUniformLocation
	specularFactorLoc: WebGLUniformLocation

	sampler0Loc: WebGLUniformLocation
	sampler1Loc: WebGLUniformLocation
	sampler2Loc: WebGLUniformLocation
	sampler3Loc: WebGLUniformLocation
	sampler4Loc: WebGLUniformLocation

	perspectiveProjectionMatrix: Float32Array
	orthoProjectionMatrix: Float32Array
	viewMatrix: Float32Array

	sceneViewCamera: Camera

	shaderProgram: ShaderProgram


	setUniforms(gl:WebGLRenderingContext, model: Geometry) {
		this.shaderProgram.activateShader()
		gl.uniformMatrix4fv(this.perspectiveMatrixLoc, false, this.perspectiveProjectionMatrix)
		gl.uniformMatrix4fv(this.cameraViewMatrixLoc , false, this.viewMatrix)
		gl.uniformMatrix4fv(this.modelMatrixLoc, false, model.transform.getModelMatrix())
		gl.uniform3fv(this.cameraPositionLoc, this.sceneViewCamera.transform.position.getFloatArray())
		return this
    }

	getLightWorldMatrix(lightViewCamera:Camera, model:Geometry){
		// first draw from the POV of the light
		return Matrix4.lookAt(
			[lightViewCamera.transform.position.x, lightViewCamera.transform.position.y, lightViewCamera.transform.position.z], // position
			[model.transform.position.x, model.transform.position.y, model.transform.position.z], // target
			[0, 1, 0],// up
		);
	}

	getTextureMatrix(lightWorldMatrix:Float32Array){
		let textureMatrix = Matrix4.identity();
		Matrix4.translate(textureMatrix, 0.5, 0.5, 0.5);
		Matrix4.scale(textureMatrix, 0.5, 0.5, 0.5);
		Matrix4.mult(textureMatrix, textureMatrix, this.orthoProjectionMatrix)
		let inverted:any = []
		Matrix4.invert(inverted, lightWorldMatrix)
		Matrix4.mult(textureMatrix, textureMatrix, inverted)
		return textureMatrix
	}
}


class Model {

  constructor() {}

  static  createGeometry(gl: WebGLRenderingContext, shaderProgram: ModelShader, vertices: ObjLoader){ 
    return  new Geometry(Model.createMesh(gl, shaderProgram, vertices)); 
  }

  static createMesh(gl: WebGLRenderingContext, shaderProgram: ModelShader, vertices: ObjLoader) {

    const vertexCount = vertices.vertexCount();
	
    const mesh: MeshData = {
      positions : new Vbuffer(gl, vertices.positions(), vertexCount, GLSetttings.BUFFER_TYPE_ARRAY),
      normals: new Vbuffer(gl, vertices.normals(), vertexCount, GLSetttings.BUFFER_TYPE_ARRAY),
      uvs: new Vbuffer(gl, vertices.uvs(), vertexCount, GLSetttings.BUFFER_TYPE_ARRAY),
      drawMode : gl.TRIANGLES,
      vertexCount,
    }

    mesh.positions?.bindToAttribute(shaderProgram.positionLoc as number, GLSetttings.DEFAULT_STRIDE, GLSetttings.DEFAULT_OFFSET)
    mesh.normals?.bindToAttribute(shaderProgram.normalLoc as number, GLSetttings.DEFAULT_STRIDE, GLSetttings.DEFAULT_OFFSET)
    mesh.uvs?.bindToAttribute(shaderProgram.texCoordLoc as number, GLSetttings.DEFAULT_STRIDE, GLSetttings.DEFAULT_OFFSET)

    return mesh;
  }
}

export {
	ModelShader,
	Model
}