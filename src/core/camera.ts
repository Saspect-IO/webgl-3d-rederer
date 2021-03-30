import ShaderProgram from "./shaderProgram";
import Transformation from "./transformation";

export default class Camera {
  constructor() {
    this.position = new Transformation();
    this.projection = new Transformation();
  }

  position: Transformation | null = null;
  projection: Transformation | null = null;

  setOrthographic(width: number, height: number, depth: number) {
    (this.projection as Transformation).matrix[0] = 2 / width;
    (this.projection as Transformation).matrix[5] = 2 / height;
    (this.projection as Transformation).matrix[10] = -2 / depth;
  }

  setPerspective(fieldOfView:number, aspectRatio:number, nearPlane:number, farPlane:number): void {
    const y = Math.tan(fieldOfView * Math.PI / 360) * nearPlane;
    const x = y * aspectRatio;
    Transformation.frustum(-x, x, -y, y, nearPlane, farPlane, this.projection as Transformation);
  }

  getInversePosition():Transformation {
    const orig = (this.position as Transformation).matrix;
    const inverse = Transformation.inverse(orig);
    return inverse;
  }

  useCamera(shaderProgram: ShaderProgram) {
    (this.projection as Transformation).sendToGpu((shaderProgram.glContext as WebGLRenderingContext), (shaderProgram.projection as WebGLUniformLocation ));
    this.getInversePosition().sendToGpu((shaderProgram.glContext as WebGLRenderingContext), (shaderProgram.view as WebGLUniformLocation ));
  }
}