import Geometry from './geometry';
import Texture from './texture';
import Transformation from './transformation';
import Vbuffer from './vbuffer';
import ShaderProgram from './shaderProgram';

export default class Mesh {

  constructor(glContext: WebGLRenderingContext, geometry: Geometry, texture: Texture) {
    this.vertexCount = geometry.vertexCount();
    this.positions = new Vbuffer(glContext, geometry.positions(), this.vertexCount);
    this.normals = new Vbuffer(glContext, geometry.normals(), this.vertexCount);
    this.uvs = new Vbuffer(glContext, geometry.uvs(), this.vertexCount);
    this.texture = texture;
    this.position = new Transformation();
    this.glContext = glContext;
  }

  vertexCount: number;
  positions: Vbuffer;
  normals: Vbuffer;
  uvs: Vbuffer;
  texture: Texture;
  position: Transformation;
  glContext: WebGLRenderingContext | null = null;


  destroy() {
    this.positions.destroy();
    this.normals.destroy();
    this.uvs.destroy();
  }

  drawMesh(shaderProgram: ShaderProgram) {
    this.positions.bindToAttribute(shaderProgram.positionIndex as number);
    this.normals.bindToAttribute(shaderProgram.normalIndex as number);
    this.uvs.bindToAttribute(shaderProgram.uvIndex as number);
    this.position.sendToGpu(this.glContext as WebGLRenderingContext, shaderProgram.model as WebGLUniformLocation);
    this.texture.useTexture(shaderProgram.diffuse as WebGLUniformLocation, 0);
    this.glContext?.drawArrays(this.glContext.TRIANGLES, 0, this.vertexCount);
  }

  static async loadMesh(glContext: WebGLRenderingContext, objSrc: string, textureSrc: string) {
    const objGeometry = await Geometry.loadOBJ(objSrc);
    const objTexture = await Texture.loadTexture(glContext, textureSrc);
    const [geometry, texture] = await Promise.all([objGeometry, objTexture]);
    const mesh = new Mesh(glContext, geometry, texture as any);

    return mesh;
  }

}