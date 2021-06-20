import Geometry from '../geometry';
import Texture from '../texture';
import Vbuffer from '../vbuffer';
import ShaderProgram from '../shaderProgram';
import ObjLoader from '../objLoader';
import { MeshData } from '@/entities';
import { GLSetttings, ShaderProgramMatrixFields } from '@/modules';


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

			'mat4 m_worldMatrix;'+
			'mat4 m_viewProjectionMatrix;'+
			'mat4 m_worldViewProjectionMatrix;'+
			
			'out vec3 v_normal;'+
			'out vec4 v_position;'+
			'out vec3 v_surfaceToLight;'+
			'out vec3 v_surfaceToCamera;'+

			'out highp vec2 v_texCoord;'+

			'void main(void){' +
				'v_texCoord = a_texCoord;'+

				'm_worldMatrix = u_mVMatrix;'+
				'm_viewProjectionMatrix = u_pMatrix * u_cameraMatrix;'+
				'm_worldViewProjectionMatrix = m_viewProjectionMatrix * m_worldMatrix;'+

				'v_position = m_worldViewProjectionMatrix * vec4(a_position, 1.0);'+
				'gl_Position = v_position;'+
				
				'v_normal = (u_cameraMatrix * vec4(a_norm, 0.0)).xyz;'+

				'vec3 v_surfaceWorldPosition = (m_worldMatrix * vec4(a_position, 1.0)).xyz;'+
				'v_surfaceToLight = u_lightPosition - v_surfaceWorldPosition;'+
				'v_surfaceToCamera = u_cameraPosition - v_surfaceWorldPosition;'+

			'}';

		const fragmentShader = '#version 300 es\n' +
			'precision mediump float;'+

			'in vec4 v_position;'+
			'in vec2 v_texCoord;'+
			'in vec3 v_normal;'+
			'in vec3 v_surfaceToLight;'+
			'in vec3 v_surfaceToCamera;'+

			'uniform vec4 u_lightColor;'+
			'uniform vec4 u_ambientLightColor;'+
			'uniform sampler2D u_diffuse;'+
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

				'vec3 normal = normalize(v_normal);'+
				'vec3 surfaceToLightDirection = normalize(v_surfaceToLight);'+
				'vec3 surfaceToCameraDirection = normalize(v_surfaceToCamera);'+
				'vec3 halfVector = normalize(surfaceToLightDirection + surfaceToCameraDirection);'+

				'vec4 diffuseColor = texture(u_diffuse, v_texCoord);'+
				'vec4 litR = lit(dot(normal, surfaceToLightDirection), dot(normal, halfVector), u_shininess);'+
				
				'vec4 mult1 = diffuseColor * litR.y;'+
				'vec4 mult2 = diffuseColor * u_ambientLightColor;'+
				'vec4 mult3 = u_specularColor * litR.z * u_specularFactor;'+
				'vec4 mult4 = u_lightColor * ( mult1 + mult2 + mult3);'+

				'vec4 outColor = mult4 * diffuseColor;'+

				'finalColor = outColor;'+
				
			'}';												

		super(gl,vertexShader, fragmentShader);

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
    
    const attrib = await Model.loadAttributes(gl, objSrc, textureSrc);
    const vertexCount = attrib.vertices.vertexCount();

    const mesh: MeshData = {
      positions : new Vbuffer(gl, attrib.vertices.positions(), vertexCount),
      normals: new Vbuffer(gl, attrib.vertices.normals(), vertexCount),
      uvs: new Vbuffer(gl, attrib.vertices.uvs(), vertexCount),
      texture: attrib.texture as Texture,
      drawMode : gl.TRIANGLES,
      vertexCount,
    }

    mesh.positions.bindToAttribute(shaderProgram.positionIndex as number, GLSetttings.DEFAULT_STRIDE, GLSetttings.DEFAULT_OFFSET);
    mesh.normals?.bindToAttribute(shaderProgram.normalIndex as number, GLSetttings.DEFAULT_STRIDE, GLSetttings.DEFAULT_OFFSET);
    mesh.uvs?.bindToAttribute(shaderProgram.texCoordLoc as number, GLSetttings.DEFAULT_STRIDE, GLSetttings.DEFAULT_OFFSET);

    return mesh;
  }
  
  static async loadAttributes(gl: WebGLRenderingContext, objSrc: string, textureSrc: string) {
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