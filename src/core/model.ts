import Geometry from './geometry';
import Texture from './texture';
import Vbuffer from './vbuffer';
import ShaderProgram from './shaderProgram';
import OBJ from './obj';
import { MeshData } from '../entities';

export default class Model {

  constructor() {}

  static async createModel(gl: WebGLRenderingContext, shaderProgram: ShaderProgram, objSrc: string, textureSrc: string){ 
    return  new Geometry(await Model.createMesh(gl, shaderProgram, objSrc, textureSrc)); 
  }

  static async createMesh(gl: WebGLRenderingContext, shaderProgram: ShaderProgram, objSrc: string, textureSrc: string) {
    
    const verts = await Model.loadVerts(gl, shaderProgram, objSrc, textureSrc);
    const vertexCount = verts.geometry.vertexCount();

    const mesh: MeshData = {
      positions : new Vbuffer(gl, verts.geometry.positions(), vertexCount),
      normals: new Vbuffer(gl, verts.geometry.normals(), vertexCount),
      uvs: new Vbuffer(gl, verts.geometry.uvs(), vertexCount),
      texture: verts.texture as Texture,
      drawMode : gl.TRIANGLES
    }

    return mesh;
  }
  
  static async loadVerts(gl: WebGLRenderingContext, shaderProgram: ShaderProgram, objSrc: string, textureSrc: string) {
    const objGeometry = await OBJ.loadOBJ(objSrc);
    const objTexture = await Texture.loadTexture(gl, textureSrc);
    const [geometry, texture] = await Promise.all([objGeometry, objTexture]);
    
    return {geometry, texture};
  }

}