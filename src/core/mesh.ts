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
    this.vertexCount = this.vertexCount;
    this.position = new Transformation();
    this.gl = gl;
  }

  vertexCount: number;
  positions: any;
  normals: any;
  uvs: any;
  texture: Texture;
  position: any;
  gl: WebGLRenderingContext | null = null;


  destroy() {
    this.positions.destroy();
    this.normals.destroy();
    this.uvs.destroy();
  }

  drawMesh(shaderProgram: ShaderProgram) {
    this.positions.bindToAttribute(shaderProgram.position);
    this.normals.bindToAttribute(shaderProgram.normal);
    this.uvs.bindToAttribute(shaderProgram.uv);
    this.position.sendToGpu(this.gl, shaderProgram.model as WebGLUniformLocation);
    this.texture.useTexture(shaderProgram.diffuse as WebGLUniformLocation, 0);
    this.gl?.drawArrays(this.gl.TRIANGLES, 0, this.vertexCount);
  }

  static async loadMesh(gl: WebGLRenderingContext, objSrc: string, textureSrc: string) {
    const geometry = await Geometry.loadOBJ(objSrc);
    const texture = await Texture.loadTexture(gl, textureSrc);
    const [geometryData, geometryTexture ] = await Promise.all([geometry, texture]);
    const mesh  = new Mesh(gl, geometryData, geometryTexture as any)

    return mesh;
  }

}