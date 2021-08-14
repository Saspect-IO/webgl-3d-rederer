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
	constructor(gl: WebGLRenderingContext, sceneViewCamera:Camera, lightViewCamera:Camera){	
		const vertexShader = `#version 300 es
			in vec3 a_position;
			in vec3 a_norm;
			in vec2 a_texCoord;

			uniform vec3 u_lightPosition;
			uniform vec3 u_cameraPosition;

			uniform mat4 u_modelViewMatrix;
			uniform mat4 u_cameraViewMatrix;
			uniform mat4 u_projectionMatrix;

			out vec3 v_normal;
			out vec3 v_surfaceToLight;
			out vec3 v_surfaceToCamera;

			out vec2 v_texCoord;

			void main(void){

				gl_Position = u_projectionMatrix * u_cameraViewMatrix * u_modelViewMatrix * vec4(a_position, 1.0);
				v_normal = (u_cameraViewMatrix * vec4(a_norm, 0.0)).xyz;

				vec3 v_surfaceWorldPosition = (u_modelViewMatrix * vec4(a_position, 1.0)).xyz;
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

			uniform sampler2D sampler;
			uniform vec4 u_lightColor;
			uniform vec4 u_ambientLightColor;
			uniform vec4 u_specularColor;
			uniform float u_shininess;
			uniform float u_specularFactor;
			uniform vec3 u_reverseLightDirection;

			vec4 lit(float l ,float h, float m) {
				return vec4(
					1.0,
					abs(l),
					(l > 0.0) ? pow(max(0.0, h), m) : 0.0,
					1.0
				);
			}

			out vec4 finalColor;

			void main(void) {

				vec4 texel = texture(sampler, v_texCoord);
				vec3 normal = normalize(v_normal);

				float lightIntensity = dot(normal, u_reverseLightDirection);
				vec4 diffuse = u_ambientLightColor + u_lightColor * lightIntensity;

				vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
				vec3 surfaceToCameraDirection = normalize(v_surfaceToCamera);
				vec3 halfVector = normalize(surfaceToLightDirection + surfaceToCameraDirection);

				vec4 specularIntensity = lit(dot(normal, surfaceToLightDirection), dot(normal, halfVector), u_shininess);
				vec4 specular = u_specularColor * specularIntensity.z * u_specularFactor;
				vec4 light = diffuse + specular;

				vec4 outColor = vec4(texel.rgb * light.xyz, texel.a);

				finalColor = outColor;
			}`;											

		const shaderProgram = new ShaderProgram(gl, vertexShader, fragmentShader)

		shaderProgram.activateShader()

		this.positionLoc = gl.getAttribLocation(shaderProgram.program as WebGLProgram, GLSetttings.ATTR_POSITION_NAME)
		this.texCoordLoc = gl.getAttribLocation(shaderProgram.program as WebGLProgram, GLSetttings.ATTR_UV_NAME)
		this.normalLoc = gl.getAttribLocation(shaderProgram.program as WebGLProgram, GLSetttings.ATTR_NORMAL_NAME)

		this.modelViewMatrixLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_VIEW_MODEL_MAT) as WebGLUniformLocation
		this.perspectiveMatrixLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_PROJECTION_MAT) as WebGLUniformLocation
		this.cameraMatrixLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_CAMERA_VIEW_MAT) as WebGLUniformLocation
		this.projectedTextureLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_PROJECTED_TEXTURE) as WebGLUniformLocation
		this.textureMatrixLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_TEXTURE_MAT) as WebGLUniformLocation
		this.reverseLightDirectionLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_REVERSE_LIGHT_DIRECTION_MAT) as WebGLUniformLocation

		this.ambientLightColorLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_LIGHT_AMBIENT) as WebGLUniformLocation
		this.lightPositionLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_LIGHT_POSITION) as WebGLUniformLocation
		this.cameraPositionLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_CAMERA_POSITION) as WebGLUniformLocation
		this.shininessLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_CAMERA_SHININESS) as WebGLUniformLocation
		this.lightColorLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_LIGHT_COLOR) as WebGLUniformLocation
		this.specularColorLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_SPECULAR_COLOR) as WebGLUniformLocation
		this.specularFactorLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_SPECULAR_FACTOR) as WebGLUniformLocation
		//Cleanup
		shaderProgram.deactivateShader()

		this.perspectiveProjectionMatrix = sceneViewCamera.perspectiveProjection
		this.orthoProjectionMatrix = sceneViewCamera.orthoProjection
		this.viewModelMatrix = sceneViewCamera.viewMatrix
		this.lightViewCamera = lightViewCamera
		this.sceneViewCamera = sceneViewCamera
		this.shaderProgram = shaderProgram
	}

	positionLoc: number
	normalLoc: number
	texCoordLoc: number
  
	modelViewMatrixLoc: WebGLUniformLocation
	perspectiveMatrixLoc: WebGLUniformLocation
	cameraMatrixLoc: WebGLUniformLocation
	textureMatrixLoc: WebGLUniformLocation
	
	projectedTextureLoc: WebGLUniformLocation
	ambientLightColorLoc: WebGLUniformLocation
	lightPositionLoc: WebGLUniformLocation
	cameraPositionLoc: WebGLUniformLocation
	shininessLoc: WebGLUniformLocation
	lightColorLoc: WebGLUniformLocation
	specularColorLoc: WebGLUniformLocation
	specularFactorLoc: WebGLUniformLocation
	reverseLightDirectionLoc: WebGLUniformLocation

	perspectiveProjectionMatrix: Float32Array
	orthoProjectionMatrix: Float32Array
	viewModelMatrix: Float32Array
	lightViewMatrix: Float32Array|null = null

	lightViewCamera: Camera
	sceneViewCamera: Camera

	shaderProgram: ShaderProgram


	setUniforms(gl:WebGLRenderingContext, model: Geometry) {
		this.shaderProgram.activateShader()

		const lightViewMatrix = this.getLightWorldMatrix(this.lightViewCamera, model) as Float32Array

		gl.uniformMatrix4fv(this.perspectiveMatrixLoc, false, this.perspectiveProjectionMatrix)
		gl.uniformMatrix4fv(this.cameraMatrixLoc , false, this.viewModelMatrix)
		gl.uniformMatrix4fv(this.textureMatrixLoc , false, this.getTextureMatrix(lightViewMatrix))
		gl.uniformMatrix4fv(this.modelViewMatrixLoc, false, model.transform.getModelMatrix())	//Set the transform, so the shader knows where the model exists in 3d space
		gl.uniform3fv(this.cameraPositionLoc, this.sceneViewCamera.transform.position.getFloatArray())
		gl.uniform3fv(this.reverseLightDirectionLoc, lightViewMatrix.slice(8, 11))
		return this
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

	getLightWorldMatrix(lightViewCamera:Camera, model:Geometry){
		// first draw from the POV of the light
		return Matrix4.lookAt(
			[lightViewCamera.transform.position.x, lightViewCamera.transform.position.y, lightViewCamera.transform.position.z], // position
			[model.transform.position.x, model.transform.position.y, model.transform.position.z], // target
			[0, 1, 0],// up
		);
	}
}


class Model {

  constructor() {}

  static  createGeometry(gl: WebGLRenderingContext, shaderProgram: ModelShader, vertices: ObjLoader, texture: Texture){ 
    return  new Geometry(Model.createMesh(gl, shaderProgram, vertices, texture)); 
  }

  static createMesh(gl: WebGLRenderingContext, shaderProgram: ModelShader, vertices: ObjLoader, texture: Texture) {

    const vertexCount = vertices.vertexCount();
	
    const mesh: MeshData = {
      positions : new Vbuffer(gl, vertices.positions(), vertexCount, GLSetttings.BUFFER_TYPE_ARRAY),
      normals: new Vbuffer(gl, vertices.normals(), vertexCount, GLSetttings.BUFFER_TYPE_ARRAY),
      uvs: new Vbuffer(gl, vertices.uvs(), vertexCount, GLSetttings.BUFFER_TYPE_ARRAY),
      texture,
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