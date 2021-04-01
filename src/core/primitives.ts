import Transformation from './transformation';
import Vbuffer from './vbuffer';
import ShaderProgram from './shaderProgram';
import { GEOMETRY_COLORS } from '../mock/colors';
import { GEOMETRY_MODEL } from '../mock/geometry';

export default class Primitives {

  constructor(gl: WebGLRenderingContext, geometry: number[], colors: number[]) {
    this.vertexCount = geometry.length;
    this.positions = new Vbuffer(gl, geometry, geometry.length);
    this.colors = new Vbuffer(gl, colors, colors.length);
    this.position = new Transformation();
    this.gl = gl;
  }

  vertexCount: number;
  positions: Vbuffer;
  position: Transformation;
  gl: WebGLRenderingContext;
  colors: Vbuffer;

  destroy() {
    this.positions.destroy();
    this.colors.destroy();
  }

  drawMockGeometry(shaderProgram: ShaderProgram) {

    const primitiveType = this.gl.TRIANGLES;
    const offset = 0;
    const count = 16 * 6;

    this.positions.bindToAttribute(shaderProgram.positionIndex as number);
    this.colors.bindToAttribute(shaderProgram.uvIndex as number);
    this.position.sendToGpu(this.gl as WebGLRenderingContext, shaderProgram.model as WebGLUniformLocation);
    
    this.gl?.drawArrays(primitiveType, offset, count);
  }

  static async loadPrimitives(gl: WebGLRenderingContext) {
    const objGeometry = GEOMETRY_MODEL;
    const objColors = GEOMETRY_COLORS;
    const [geometry, colors] = await Promise.all([objGeometry, objColors]); 
    const primititve = new Primitives(gl, geometry, colors);
    return primititve;
  }

}