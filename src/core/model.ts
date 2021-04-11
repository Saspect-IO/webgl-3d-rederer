import Geometry from './geometry';
import Texture from './texture';
import Vbuffer from './vbuffer';
import ShaderProgram from './shaderProgram';
import OBJ from './obj';
import { MeshData } from '@/entities';
import { GLSetttings } from '@/modules';

export default class Model {

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