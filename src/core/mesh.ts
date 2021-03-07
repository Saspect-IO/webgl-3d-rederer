import Geometry from './geometry';
import Texture from './texture';
import Transformation from './transformation';
import Vbuffer from './vbuffer';
import ShaderProgram  from './shaderProgram';

export default class Mesh {

  constructor(gl: WebGLRenderingContext, geometry:any, texture:any) {
      this.vertexCount = geometry.vertexCount();
      this.positions = new Vbuffer(gl, geometry.positions(), this.vertexCount);
      this.normals = new Vbuffer(gl, geometry.normals(), this.vertexCount);
      this.uvs = new Vbuffer(gl, geometry.uvs(), this.vertexCount);
      this.texture = texture;
      this.vertexCount = this.vertexCount;
      this.position = new Transformation();
      this.gl = gl;
  }

  vertexCount:number;
  positions:any;
  normals:any;
  uvs:any;
  texture:any;
  position:any;
  gl: WebGLRenderingContext = null;


  destroy() {
    this.positions.destroy();
    this.normals.destroy();
    this.uvs.destroy();
  }

  drawMesh(shaderProgram: ShaderProgram) {
    this.positions.bindToAttribute(shaderProgram.position);
    this.normals.bindToAttribute(shaderProgram.normal);
    this.uvs.bindToAttribute(shaderProgram.uv);
    this.position.sendToGpu(this.gl, shaderProgram.model);
    this.texture.use(shaderProgram.diffuse, 0);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexCount);
  }

  static async loadMesh(gl: WebGLRenderingContext, modelPath: string, texturePath: string) {
    const geometry = Geometry.loadOBJ(modelPath);
    const texture = Texture.loadTexture(gl, texturePath);
    return Promise.all([geometry, texture]).then(function (params) {
      return new Mesh(gl, params[0], params[1]);
    })
  }

}