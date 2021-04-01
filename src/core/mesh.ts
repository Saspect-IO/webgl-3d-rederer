import Geometry from './geometry';
import Texture from './texture';
import Transformation from './transformation';
import Vbuffer from './vbuffer';
import ShaderProgram from './shaderProgram';

export default class Mesh {

  constructor(gl: WebGLRenderingContext, geometry: Geometry, texture: Texture) {
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
    this.positions.bindToAttribute(shaderProgram.positionIndex as number);
    this.normals.bindToAttribute(shaderProgram.normalIndex as number);
    this.uvs.bindToAttribute(shaderProgram.uvIndex as number);
    this.position.sendToGpu(this.gl as WebGLRenderingContext, shaderProgram.modalMatrix as WebGLUniformLocation);
    this.texture.useTexture(shaderProgram.mainTexture as WebGLUniformLocation, 0);
    this.gl?.drawArrays(this.gl.TRIANGLES, 0, this.vertexCount);
  }

  static async loadMesh(gl: WebGLRenderingContext, objSrc: string, textureSrc: string) {
    const objGeometry = await Geometry.loadOBJ(objSrc);
    const objTexture = await Texture.loadTexture(gl, textureSrc);
    const [geometry, texture] = await Promise.all([objGeometry, objTexture]);
    const mesh = new Mesh(gl, geometry, texture as any);
    
    return mesh;
  }

}