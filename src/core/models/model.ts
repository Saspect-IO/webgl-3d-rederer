import Geometry from '../geometry';
import Texture from '../Textures/texture';
import Vbuffer from '../vbuffer';
import ShaderProgram from '../shaderProgram';
import ObjLoader from '../objLoader';
import { MeshData } from '@/entities';
import { GLSetttings, ProgramEntrySettings, ShaderProgramMatrixFields } from '@/modules';
import DepthTexture from '../Textures/depthTexture';


class ModelShader extends ShaderProgram{
	constructor(gl: WebGLRenderingContext, projectionMatrix: Float32Array){	
		const vertexShader = '#version 300 es\n' +
			'in vec3 a_position;'+
			'in vec3 a_norm;'+
			'in vec2 a_texCoord;'+

			'uniform vec3 u_lightPosition;'+
			'uniform vec3 u_cameraPosition;'+

			'uniform mat4 u_mVMatrix;'+	
			'uniform mat4 u_cameraMatrix;'+
			'uniform mat4 u_pMatrix;'+
			'uniform mat4 u_oMatrix;'+
			

			'mat4 m_worldMatrix;'+
			'mat4 m_viewProjectionMatrix;'+
			'mat4 m_worldViewProjectionMatrix;'+
			'mat4 m_textureMatrix;'+
			
			'out vec3 v_normal;'+
			'out vec3 v_surfaceToLight;'+
			'out vec3 v_surfaceToCamera;'+

			'out vec2 v_texCoord;'+
			'out vec4 v_projectedTexcoord;'+

			'void main(void){'+


				'm_worldMatrix = u_mVMatrix;'+
				'm_viewProjectionMatrix = u_pMatrix * u_cameraMatrix;'+
				'm_worldViewProjectionMatrix = m_viewProjectionMatrix * m_worldMatrix;'+
				'm_textureMatrix = u_oMatrix * u_cameraMatrix * m_worldMatrix;'+

				'gl_Position = m_worldViewProjectionMatrix * vec4(a_position, 1.0);'+
				
				'v_normal = (u_cameraMatrix * vec4(a_norm, 0.0)).xyz;'+

				'vec3 v_surfaceWorldPosition = (m_worldMatrix * vec4(a_position, 1.0)).xyz;'+
				'v_surfaceToLight = u_lightPosition - v_surfaceWorldPosition;'+
				'v_surfaceToCamera = u_cameraPosition - v_surfaceWorldPosition;'+

				'v_texCoord = a_texCoord;'+
				'v_projectedTexcoord = m_textureMatrix * vec4(v_surfaceWorldPosition, 1.0);'+

			'}';

		const fragmentShader = '#version 300 es\n' +
			'precision mediump float;'+

			'in vec2 v_texCoord;'+
			'in vec4 v_projectedTexcoord;'+
			'in vec3 v_normal;'+
			'in vec3 v_surfaceToLight;'+
			'in vec3 v_surfaceToCamera;'+
			
			'uniform vec4 u_lightColor;'+
			'uniform vec4 u_ambientLightColor;'+
			'uniform sampler2D u_diffuse;'+
			'uniform sampler2D u_projectedTexture;'+
			'uniform vec4 u_specularColor;'+
			'uniform float u_shininess;'+
			'uniform float u_specularFactor;'+

			'vec4 lit(float l ,float h, float m) {'+
				'return vec4('+
					'1.0,'+
					'abs(l),'+
					'(l > 0.0) ? pow(max(0.0, h), m) : 0.0,'+
					'1.0'+
				');'+
			'}'+

			'out vec4 finalColor;'+

			'void main(void) {'+

				'vec3 projectedTexcoord = v_projectedTexcoord.xyz / v_projectedTexcoord.w;'+
				'bool inRange ='+
					'projectedTexcoord.x >= 0.0 &&'+
					'projectedTexcoord.x <= 1.0 &&'+
					'projectedTexcoord.y >= 0.0 &&'+
					'projectedTexcoord.y <= 1.0;'+

				'vec3 normal = normalize(v_normal);'+
				'vec3 surfaceToLightDirection = normalize(v_surfaceToLight);'+
				'vec3 surfaceToCameraDirection = normalize(v_surfaceToCamera);'+
				'vec3 halfVector = normalize(surfaceToLightDirection + surfaceToCameraDirection);'+

				'vec4 projectedTexColor = texture(u_projectedTexture, projectedTexcoord.xy);'+
				'vec4 diffuseColor = texture(u_diffuse, v_texCoord);'+
				'vec4 litR = lit(dot(normal, surfaceToLightDirection), dot(normal, halfVector), u_shininess);'+
				
				'vec4 mult1 = diffuseColor * litR.y;'+
				'vec4 mult2 = diffuseColor * u_ambientLightColor;'+
				'vec4 mult3 = u_specularColor * litR.z * u_specularFactor;'+
				'vec4 mult4 = u_lightColor * ( mult1 + mult2 + mult3);'+

				'vec4 outColor = mult4 * diffuseColor;'+
				'float projectedAmount = inRange ? 1.0 : 0.0;'+
				'finalColor = mix(outColor, projectedTexColor, projectedAmount);'+
				//'finalColor = outColor;'+
				
			'}';												

		super(gl,vertexShader, fragmentShader);

		this.texCoordLoc = gl.getAttribLocation(this.shaderProgram as WebGLProgram , GLSetttings.ATTR_UV_NAME)
		this.normalLoc = gl.getAttribLocation(this.shaderProgram as WebGLProgram , GLSetttings.ATTR_NORMAL_NAME)

		this.diffuse = gl.getUniformLocation(this.shaderProgram as WebGLProgram , GLSetttings.UNI_DIFFUSE) as WebGLUniformLocation
		this.ambientLightColor = gl.getUniformLocation(this.shaderProgram as WebGLProgram , GLSetttings.UNI_LIGHT_AMBIENT) as WebGLUniformLocation
		this.lightPosition = gl.getUniformLocation(this.shaderProgram as WebGLProgram , GLSetttings.UNI_LIGHT_POSITION) as WebGLUniformLocation
		this.cameraPosition = gl.getUniformLocation(this.shaderProgram as WebGLProgram , GLSetttings.UNI_CAMERA_POSITION) as WebGLUniformLocation
		this.shininessLocation = gl.getUniformLocation(this.shaderProgram as WebGLProgram , GLSetttings.UNI_CAMERA_SHININESS) as WebGLUniformLocation
		this.lightColorLocation = gl.getUniformLocation(this.shaderProgram as WebGLProgram , GLSetttings.UNI_LIGHT_COLOR) as WebGLUniformLocation
		this.specularColorLocation = gl.getUniformLocation(this.shaderProgram as WebGLProgram , GLSetttings.UNI_SPECULAR_COLOR) as WebGLUniformLocation
		this.specularFactorLocation = gl.getUniformLocation(this.shaderProgram as WebGLProgram , GLSetttings.UNI_SPECULAR_FACTOR) as WebGLUniformLocation

		this.updateGPU(projectionMatrix, ShaderProgramMatrixFields.PERSPECTIVE_MATRIX);

		//Cleanup
		this.deactivateShader();
	}
}


class Model {

  constructor() {}

  static async createGeometry(gl: WebGLRenderingContext, shaderProgram: ShaderProgram, objSrc: string, textureSrc: string){ 
    return  new Geometry(await Model.createMesh(gl, shaderProgram, objSrc, textureSrc)); 
  }

  static async createMesh(gl: WebGLRenderingContext, shaderProgram: ShaderProgram, objSrc: string, textureSrc: string) {
    
    const model = await Model.loadModel(gl, objSrc, textureSrc);
    const vertexCount = model.vertices.vertexCount();

    const mesh: MeshData = {
      positions : new Vbuffer(gl, model.vertices.positions(), vertexCount),
      normals: new Vbuffer(gl, model.vertices.normals(), vertexCount),
      uvs: new Vbuffer(gl, model.vertices.uvs(), vertexCount),
      texture: model.texture,

      drawMode : gl.TRIANGLES,
      vertexCount,
    }
	// shaderProgram.activateShader();
    mesh.positions.bindToAttribute(shaderProgram.positionLoc as number, GLSetttings.DEFAULT_STRIDE, GLSetttings.DEFAULT_OFFSET);
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
	ModelShader,
	Model
}