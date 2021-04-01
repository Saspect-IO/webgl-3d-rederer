import ShaderProgram from "./shaderProgram";
import Transformation from "./transformation";

export default class Camera {
  constructor() {
    this.position = new Transformation();
    this.projection = new Transformation();
  }

  position: Transformation | null = null;
  projection: Transformation | null = null;

  setOrthographic(left: number, right: number, top: number, bottom: number, near: number, far:number) {
    console.log({left, right, top, bottom, near, far});
    
    (this.projection as Transformation).matrix[0] = 2 / (right - left);
    (this.projection as Transformation).matrix[5] = 2 / (bottom - top);
    (this.projection as Transformation).matrix[10] = 2 / (near - far);
  }

  setPerspective(fieldOfView:number, aspectRatio:number, near:number, far:number): void {
    const f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfView);
    const rangeInv = 1.0 / (near - far);
    (this.projection as Transformation).matrix[0] = f / aspectRatio;
    (this.projection as Transformation).matrix[5] = f;
    (this.projection as Transformation).matrix[10] = (near + far) * rangeInv;
    (this.projection as Transformation).matrix[11] = -1;
    (this.projection as Transformation).matrix[14] = near * far * rangeInv * 2;
  }

  getInversePosition():Transformation {
    const orig = (this.position as Transformation).matrix;
    const inverse = Transformation.inverse(orig);
    // console.log(inverse.matrix);
    
    return inverse;
  }

  useCamera(shaderProgram: ShaderProgram) {
    (this.projection as Transformation).sendToGpu((shaderProgram.glContext as WebGLRenderingContext), (shaderProgram.projection as WebGLUniformLocation ));
    this.getInversePosition().sendToGpu((shaderProgram.glContext as WebGLRenderingContext), (shaderProgram.view as WebGLUniformLocation ));
  }
}