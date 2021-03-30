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

  setPerspective(fieldOfViewInRadians:number, aspectRatio:number, nearPlane:number, farPlane:number) {
    const f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
    const rangeInv = 1.0 / (nearPlane - farPlane);
    (this.projection as Transformation).matrix[0] = f / aspectRatio;
    (this.projection as Transformation).matrix[5] = f;
    (this.projection as Transformation).matrix[10] = (nearPlane + farPlane) * rangeInv;
    (this.projection as Transformation).matrix[11] = -1;
    (this.projection as Transformation).matrix[14] = nearPlane * farPlane * rangeInv * 2;
    (this.projection as Transformation).matrix[15] = 0;
  }

  getInversePosition():Transformation {
    const orig = (this.position as Transformation).matrix;
    const tranform = new Transformation();
    const x = orig[12];
    const y = orig[13];
    const z = orig[14];
    // Transpose the rotation matrix
    for (let i = 0; i < 3; ++i) {
      for (let j = 0; j < 3; ++j) {
        tranform.matrix[i * 4 + j] = orig[i + j * 4];
      }
    }

    // Translation by -p will apply R^T, which is equal to R^-1
    const inverse = tranform.translate(-x, -y, -z);
    return inverse
  }

  useCamera(shaderProgram: any) {
    (this.projection as Transformation).sendToGpu(shaderProgram.glContext, shaderProgram.projection);
    this.getInversePosition().sendToGpu(shaderProgram.glContext, shaderProgram.view);
  }
}