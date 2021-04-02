import Model from './model';
import Texture from './texture';
import Transformation from './transformation';
import Vbuffer from './vbuffer';
import ShaderProgram from './shaderProgram';

export default class Mesh {

  constructor(gl: WebGLRenderingContext, geometry: Model, texture: Texture) {
    this.vertexCount = geometry.vertexCount();
    this.positions = new Vbuffer(gl, geometry.positions(), this.vertexCount);
    this.normals = new Vbuffer(gl, geometry.normals(), this.vertexCount);
    this.uvs = new Vbuffer(gl, geometry.uvs(), this.vertexCount);
    this.texture = texture;
    this.position = new Transformation();
    this.gl = gl;
  }

  vertexCount: number;
  positions: Vbuffer;
  normals: Vbuffer;
  uvs: Vbuffer;
  texture: Texture;
  position: Transformation;
  gl: WebGLRenderingContext | null = null;


  destroy() {
    this.positions.destroy();
    this.normals.destroy();
    this.uvs.destroy();
  }

  drawMesh(shaderProgram: ShaderProgram) {
    this.positions.bindToAttribute(shaderProgram.positionIndex as number, 0, 0);
    this.normals.bindToAttribute(shaderProgram.normalIndex as number, 0, 0);
    this.uvs.bindToAttribute(shaderProgram.uvIndex as number, 0, 0);
    this.position.sendToGpu(this.gl as WebGLRenderingContext, shaderProgram.modalMatrix as WebGLUniformLocation);
    this.texture.useTexture(shaderProgram.mainTexture as WebGLUniformLocation, 0);
    this.gl?.drawArrays(this.gl.TRIANGLES, 0, this.vertexCount);
  }

  static async loadMesh(gl: WebGLRenderingContext, objSrc: string, textureSrc: string) {
    const objModel = await Model.loadOBJ(objSrc);
    const objTexture = await Texture.loadTexture(gl, textureSrc);
    const [model, texture] = await Promise.all([objModel, objTexture]);
    const mesh = new Mesh(gl, model, texture as any);
    
    return mesh;
  }

}