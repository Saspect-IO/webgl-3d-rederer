import Geometry from '../geometry';
import Texture from '../texture';
import Vbuffer from '../vbuffer';
import ShaderProgram from '../shaderProgram';
import OBJ from '../obj';
import { MeshData } from '@/entities';
import { GLSetttings } from '@/modules';


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
			'uniform sampler2D uMainTexture;'+

			'in vec3 vNormal;'+
			'in highp vec2 texCoord;'+

			'out vec4 finalColor;'+
			'void main(void) {'+
				'float lightness = -clamp(dot(normalize(vNormal), normalize(lightDirection)), -1.0, 0.0);'+
				'lightness = ambientLight + (1.0 - ambientLight) * lightness;'+
				'finalColor = texture(uMainTexture, texCoord);'+
			'}';												

		super(gl,vertexShader, fragmentShader);

		this.setPerspective(projectionMatrix);

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
    mesh.uvs?.bindToAttribute(shaderProgram.uvIndex as number, GLSetttings.DEFAULT_STRIDE, GLSetttings.DEFAULT_OFFSET);

    return mesh;
  }
  
  static async loadAttributes(gl: WebGLRenderingContext, objSrc: string, textureSrc: string) {
    const objVertices = await OBJ.loadOBJ(objSrc);
    const objTexture = await Texture.loadTexture(gl, textureSrc);
    const [vertices, texture] = await Promise.all([objVertices, objTexture]);
    
    return {vertices, texture};
  }

}

export {
	ModelShader,
	Model
}