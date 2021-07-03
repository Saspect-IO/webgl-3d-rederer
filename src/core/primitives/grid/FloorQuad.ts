import Geometry from '../../geometry';
import Texture from '../../Textures/texture';
import Vbuffer from '../../vbuffer';
import ShaderProgram from '../../shaderProgram';
import ObjLoader from '../../objLoader';
import { MeshData } from '@/entities';
import { GLSetttings } from '@/modules';
import { Camera } from '../../camera';
import { Matrix4 } from '../../math';

class FloorQuadShader{
	constructor(gl: WebGLRenderingContext, camera:Camera, lightViewCamera:Camera){	
		const vertexShader = `#version 300 es
            layout(location=5) in vec3 a_position;
			layout(location=6) in vec3 a_norm;
			layout(location=7) in vec2 a_texCoord;

			uniform vec3 u_lightPosition;
			uniform vec3 u_cameraPosition;

			uniform mat4 u_mVMatrix;
			uniform mat4 u_cameraViewMatrix;
			uniform mat4 u_lightViewCameraMatrix;
			uniform mat4 u_pMatrix;
			uniform mat4 u_oMatrix;
			uniform mat4 u_textureMatrix;

			mat4 m_worldMatrix;
			mat4 m_viewProjectionMatrix;
			mat4 m_worldViewProjectionMatrix;
			mat4 m_textureMatrix;
			
			out vec3 v_normal;
			out vec3 v_surfaceToLight;
			out vec3 v_surfaceToCamera;

			out vec2 v_texCoord;
			out vec4 v_projectedTexcoord;

			void main(void){

				m_worldMatrix = u_mVMatrix;
				m_viewProjectionMatrix = u_pMatrix * u_cameraViewMatrix;
				m_worldViewProjectionMatrix = m_viewProjectionMatrix * m_worldMatrix;
				m_textureMatrix = u_textureMatrix;

				gl_Position = m_worldViewProjectionMatrix * vec4(a_position, 1.0);
				
				v_normal = (u_cameraViewMatrix * vec4(a_norm, 0.0)).xyz;

				vec3 v_surfaceWorldPosition = (m_worldMatrix * vec4(a_position, 1.0)).xyz;
				v_surfaceToLight = u_lightPosition - v_surfaceWorldPosition;
				v_surfaceToCamera = u_cameraPosition - v_surfaceWorldPosition;

				v_texCoord = a_texCoord;
				v_projectedTexcoord = m_textureMatrix * vec4(v_surfaceWorldPosition, 1.0);
			}`;

		const fragmentShader = `#version 300 es
			precision highp float;

			in vec2 v_texCoord;
			in vec4 v_projectedTexcoord;
			in vec3 v_normal;
			in vec3 v_surfaceToLight;
			in vec3 v_surfaceToCamera;
			
			uniform vec4 u_lightColor;
			uniform vec4 u_ambientLightColor;
			uniform sampler2D u_diffuse;
			uniform sampler2D u_projectedTexture;
			uniform vec4 u_specularColor;
			uniform float u_shininess;
			uniform float u_specularFactor;
			uniform float u_bias;
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

				vec3 normal = normalize(v_normal);

				float light = dot(normal, u_reverseLightDirection);

				vec3 projectedTexcoord = v_projectedTexcoord.xyz / v_projectedTexcoord.w;
				float currentDepth = projectedTexcoord.z + u_bias;

				bool inRange =+
					projectedTexcoord.x >= 0.0 &&+
					projectedTexcoord.x <= 1.0 &&+
					projectedTexcoord.y >= 0.0 &&+
					projectedTexcoord.y <= 1.0;

				float projectedDepth = texture(u_projectedTexture, projectedTexcoord.xy).r;
				float shadowLight = (inRange && projectedDepth <= currentDepth) ? 1.0 : 1.0;

				vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
				vec3 surfaceToCameraDirection = normalize(v_surfaceToCamera);
				vec3 halfVector = normalize(surfaceToLightDirection + surfaceToCameraDirection);


				vec4 diffuseColor = texture(u_diffuse, v_texCoord);
				vec4 litR = lit(dot(normal, surfaceToLightDirection), dot(normal, halfVector), u_shininess);
				
				vec4 mult1 = diffuseColor * litR.y;
				vec4 mult2 = diffuseColor * u_ambientLightColor;
				vec4 mult3 = u_specularColor * litR.z * u_specularFactor;
				vec4 mult4 = u_lightColor * ( mult1 + mult2 + mult3);

				vec4 outColor = mult4 * vec4(
					diffuseColor.rgb * light * shadowLight,
					diffuseColor.a);


				finalColor = outColor;
			}`;											

		const shaderProgram = new ShaderProgram(gl, vertexShader, fragmentShader);

		shaderProgram.activateShader()

		this.positionLoc = gl.getAttribLocation(shaderProgram.program as WebGLProgram, GLSetttings.ATTR_POSITION_NAME)
		this.texCoordLoc = gl.getAttribLocation(shaderProgram.program as WebGLProgram, GLSetttings.ATTR_UV_NAME)
		this.normalLoc = gl.getAttribLocation(shaderProgram.program as WebGLProgram, GLSetttings.ATTR_NORMAL_NAME)

		this.modelViewMatrixLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_MODEL_MAT) as WebGLUniformLocation
		this.perspectiveMatrixLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_PERSPECTIV_MAT) as WebGLUniformLocation
		this.cameraMatrixLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_CAMERA_MAT) as WebGLUniformLocation
		this.lightViewCameraMatrixLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_LIGHT_VIEW_CAMERA_MAT) as WebGLUniformLocation
		this.orthoMatrixLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_ORTHO_MAT) as WebGLUniformLocation
		this.projectedTextureLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_PROJECTED_TEXTURE) as WebGLUniformLocation
		this.textureMatrixLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_TEXTURE_MAT) as WebGLUniformLocation
		this.reverseLightDirectionLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_REVERSE_LIGHT_DIRECTION_MAT) as WebGLUniformLocation

		this.diffuseLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_DIFFUSE) as WebGLUniformLocation
		this.ambientLightColorLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_LIGHT_AMBIENT) as WebGLUniformLocation
		this.lightPositionLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_LIGHT_POSITION) as WebGLUniformLocation
		this.cameraPositionLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_CAMERA_POSITION) as WebGLUniformLocation
		this.shininessLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_CAMERA_SHININESS) as WebGLUniformLocation
		this.lightColorLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_LIGHT_COLOR) as WebGLUniformLocation
		this.specularColorLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_SPECULAR_COLOR) as WebGLUniformLocation
		this.specularFactorLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_SPECULAR_FACTOR) as WebGLUniformLocation
		//Cleanup
		shaderProgram.deactivateShader()

		this.perspectiveProjectionMatrix = camera.perspectiveProjection
		this.orthoProjectionMatrix = camera.orthoProjection
		this.viewModelMatrix = camera.viewMatrix
		this.lightViewModelMatrix = lightViewCamera.viewMatrix
		this.shaderProgram = shaderProgram
	}

	positionLoc: number
	normalLoc: number
	texCoordLoc: number
  
	modelViewMatrixLoc: WebGLUniformLocation
	perspectiveMatrixLoc: WebGLUniformLocation
	cameraMatrixLoc: WebGLUniformLocation
	lightViewCameraMatrixLoc: WebGLUniformLocation
	orthoMatrixLoc: WebGLUniformLocation
	textureMatrixLoc: WebGLUniformLocation

	diffuseLoc: WebGLUniformLocation
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
	orthoProjectionMatrix:Float32Array
	viewModelMatrix:Float32Array
	lightViewModelMatrix:Float32Array

	shaderProgram: ShaderProgram


	setUniforms(gl:WebGLRenderingContext, model: Geometry) {
		this.shaderProgram.activateShader()
		gl.uniformMatrix4fv(this.perspectiveMatrixLoc, false, this.perspectiveProjectionMatrix)
        gl.uniformMatrix4fv(this.orthoMatrixLoc , false, this.orthoProjectionMatrix)
		gl.uniformMatrix4fv(this.cameraMatrixLoc , false, this.viewModelMatrix)
		gl.uniformMatrix4fv(this.lightViewCameraMatrixLoc , false, this.lightViewModelMatrix)
		gl.uniform3fv(this.reverseLightDirectionLoc , this.lightViewModelMatrix.slice(8, 11))
		gl.uniformMatrix4fv(this.textureMatrixLoc , false, this.getTextureMatrix())
		gl.uniformMatrix4fv(this.modelViewMatrixLoc, false, model.transform.getModelMatrix())	//Set the transform, so the shader knows where the model exists in 3d space

		return this
    }

	getTextureMatrix(){
		let textureMatrix = Matrix4.identity();
		Matrix4.translate(textureMatrix, 0.5, 0.5, 0.5);
		Matrix4.scale(textureMatrix, 0.5, 0.5, 0.5);
		Matrix4.mult(textureMatrix, textureMatrix, this.orthoProjectionMatrix)
		let inverted:any = []
		Matrix4.invert(inverted, this.lightViewModelMatrix)
		Matrix4.mult(textureMatrix, textureMatrix, inverted)
		return textureMatrix
	}

}


class FloorQuad {

  constructor() {}

   static async createGeometry(gl: WebGLRenderingContext, shaderProgram: FloorQuadShader){ 
    return  new Geometry( await FloorQuad.createMesh(gl, shaderProgram)); 
  }

   static async createMesh(gl: WebGLRenderingContext, shaderProgram: FloorQuadShader) {

	const verts = [
        -1,0.002,1,
		1,0.002,1,
		1,0.002,-1,
		-1,0.002,1,
		1,0.002,-1,
		-1,0.002,-1,
    ]
    const norms = [
        0,0,0,
        0,0,0,
        0,0,0,
        0,0,0,
        0,0,0,
        0,0,0,
    ]
    const uvs =  [ 0,0, 0,1, 1,1, 1,0 ]
    
    const texture = await Texture.loadTexture(gl, '/assets/resources/floor/textures/floor.jpg');
    const vertexCount = verts.length/3;
	const strideLen = Float32Array.BYTES_PER_ELEMENT * 3; //Stride Length is the Vertex Size for the buffer in Bytes
    const mesh: MeshData = {
      positions : new Vbuffer(gl, verts, vertexCount, GLSetttings.BUFFER_TYPE_VERTICES),
      normals: new Vbuffer(gl, norms, vertexCount, GLSetttings.BUFFER_TYPE_VERTICES),
      uvs: new Vbuffer(gl, uvs, vertexCount, GLSetttings.BUFFER_TYPE_VERTICES),
      texture: texture,
      drawMode : gl.TRIANGLES,
      vertexCount,
    }

    mesh.positions?.bindToAttribute(shaderProgram.positionLoc as number, strideLen, GLSetttings.DEFAULT_OFFSET, GLSetttings.GRID_VECTOR_SIZE);
    mesh.normals?.bindToAttribute(shaderProgram.normalLoc as number, GLSetttings.DEFAULT_STRIDE, GLSetttings.DEFAULT_OFFSET);
    mesh.uvs?.bindToAttribute(shaderProgram.texCoordLoc as number, GLSetttings.DEFAULT_STRIDE, GLSetttings.DEFAULT_OFFSET);

    return mesh;
  }
  
  static async loadModel(gl: WebGLRenderingContext, objSrc: string, textureSrc: string) {
    const objVertices = await ObjLoader.loadOBJ(objSrc);
    const objTexture = await Texture.loadTexture(gl, textureSrc);
    const [vertices, texture] = await Promise.all([objVertices, objTexture]);
    
    return {vertices, texture};
  }

}

export {
	FloorQuadShader,
	FloorQuad
}