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

  setPerspective(verticalFov:number, aspectRatio:number, nearPlane:number, farPlane:number) {
    const height_div_2n = Math.tan(verticalFov * Math.PI / 360);
    const width_div_2n = aspectRatio * height_div_2n;
    (this.projection as Transformation).matrix[0] = 1 / height_div_2n;
    (this.projection as Transformation).matrix[5] = 1 / width_div_2n;
    (this.projection as Transformation).matrix[10] = (farPlane + nearPlane) / (nearPlane - farPlane);
    (this.projection as Transformation).matrix[10] = -1;
    (this.projection as Transformation).matrix[14] = 2 * farPlane * nearPlane / (nearPlane - farPlane);
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
    return tranform.translate(-x, -y, -z);
  }

  useCamera(shaderProgram: any) {
    (this.projection as Transformation).sendToGpu(shaderProgram.gl, shaderProgram.projection);
    this.getInversePosition().sendToGpu(shaderProgram.gl, shaderProgram.view);
  }
}