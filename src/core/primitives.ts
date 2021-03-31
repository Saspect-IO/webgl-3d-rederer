import Transformation from './transformation';
import Vbuffer from './vbuffer';
import ShaderProgram from './shaderProgram';
import { GEOMETRY_COLORS } from '@/mock/colors';
import { GEOMETRY_MODEL } from '@/mock/geometry';

export default class Primitives {

  constructor(glContext: WebGLRenderingContext, geometry: number[], colors: number[]) {
    this.vertexCount = geometry.length;
    this.positions = new Vbuffer(glContext, geometry, geometry.length);
    this.colors = new Vbuffer(glContext, colors, colors.length);
    this.position = new Transformation();
    this.glContext = glContext;
  }

  vertexCount: number;
  positions: Vbuffer;
  position: Transformation;
  glContext: WebGLRenderingContext;
  colors: Vbuffer;

  destroy() {
    this.positions.destroy();
    this.colors.destroy();
  }

  drawMockGeometry(shaderProgram: ShaderProgram) {
    this.positions.bindToAttribute(shaderProgram.positionIndex as number);
    this.colors.bindToAttribute(shaderProgram.uvIndex as number);
    this.position.sendToGpu(this.glContext as WebGLRenderingContext, shaderProgram.model as WebGLUniformLocation);
    this.glContext?.drawArrays(this.glContext.TRIANGLES, 0, this.vertexCount);
  }

  static async loadPrimitives(glContext: WebGLRenderingContext) {
    const objGeometry = GEOMETRY_MODEL;
    const objTexture = GEOMETRY_COLORS;
    const [geometry, colors] = await Promise.all([objGeometry, objTexture]);
    const primititve = new Primitives(glContext, geometry, colors);

    return primititve;
  }

}