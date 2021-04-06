import Geometry from './geometry';
import Texture from './texture';
import Vbuffer from './vbuffer';
import ShaderProgram from './shaderProgram';
import OBJ from './obj';
import { GLSetttings } from '../modules';

export default class Model extends Geometry{

  constructor(gl: WebGLRenderingContext, shaderProgram: ShaderProgram, geometry: OBJ, texture: Texture) {

    super(gl, geometry.vertexCount(), geometry.positions());

    this.normals = new Vbuffer(gl, geometry.normals(), this.vertexCount);
    this.uvs = new Vbuffer(gl, geometry.uvs(), this.vertexCount);
    this.texture = texture;

    this.positions.bindToAttribute(shaderProgram.positionIndex as number, GLSetttings.DEFAULT_STRIDE, GLSetttings.DEFAULT_OFFSET);
    this.normals.bindToAttribute(shaderProgram.normalIndex as number, GLSetttings.DEFAULT_STRIDE, GLSetttings.DEFAULT_OFFSET);
    this.uvs.bindToAttribute(shaderProgram.uvIndex as number, GLSetttings.DEFAULT_STRIDE, GLSetttings.DEFAULT_OFFSET);

    this.drawMode = gl.TRIANGLES;
  }

  normals: Vbuffer;
  uvs: Vbuffer;
  texture: Texture;
  gl: WebGLRenderingContext | null = null;

  destroy() {
    this.normals.destroy();
    this.uvs.destroy();
  }

  static async loadModel(gl: WebGLRenderingContext, shaderProgram: ShaderProgram, objSrc: string, textureSrc: string) {
    const objModel = await OBJ.loadOBJ(objSrc);
    const objTexture = await Texture.loadTexture(gl, textureSrc);
    const [model, texture] = await Promise.all([objModel, objTexture]);
    const mesh = new Model(gl, shaderProgram, model, texture as any);
    
    return mesh;
  }

}