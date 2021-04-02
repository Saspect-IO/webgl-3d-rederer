import {
  GLSetttings
} from "../modules";
import ShaderProgram from "./shaderProgram";
import Transformation from "./transformation";
import Vbuffer from "./vbuffer";
class GridAxis {

  constructor(gl: WebGLRenderingContext, vertexComponentLen: number, gridPositions: number[]) {
    this.vertexComponentLen  = vertexComponentLen;
    this.vertexCount = gridPositions.length/vertexComponentLen;
    this.positions = new Vbuffer(gl, gridPositions, this.vertexCount);
    this.transform = new Transformation();
    this.gl = gl;
    this.drawMode = gl.LINES;
  }

  vertexComponentLen: number;
  vertexCount: number;
  positions: Vbuffer;
  transform: Transformation;
  gl: WebGLRenderingContext | null = null;
  drawMode: number;

  destroy() {
    this.positions.destroy();
  }

  //--------------------------------------------------------------------------
  //Getters/Setters
  setScale(x: number, y: number, z: number) {
    this.transform.scale.set(x, y, z);
    return this;
  }

  setPosition(x: number, y: number, z: number) {
    this.transform.position.set(x, y, z);
    return this;
  }

  setRotation(x: number, y: number, z: number) {
    this.transform.rotation.set(x, y, z);
    return this;
  }

  addScale(x: number, y: number, z: number) {
    this.transform.scale.x += x;
    this.transform.scale.y += y;
    this.transform.scale.y += y;
    return this;
  }

  addPosition(x: number, y: number, z: number) {
    this.transform.position.x += x;
    this.transform.position.y += y;
    this.transform.position.z += z;
    return this;
  }

  addRotation(x: number, y: number, z: number) {
    this.transform.rotation.x += x;
    this.transform.rotation.y += y;
    this.transform.rotation.z += z;
    return this;
  }

  preRender() {
    this.transform.updateMatrix();
    return this;
  }

  drawGrid(shaderProgram: ShaderProgram) {
    const strideLen = Float32Array.BYTES_PER_ELEMENT * this.vertexComponentLen; //Stride Length is the Vertex Size for the buffer in Bytes
    const offset = Float32Array.BYTES_PER_ELEMENT * 3;
    this.positions.bindToAttribute(shaderProgram.gridIndex as number, strideLen, 0, GLSetttings.GRID_VECTOR_SIZE);
    this.positions.bindToAttribute(shaderProgram.colorIndex as number, strideLen, offset, GLSetttings.GRID_COLOR_SIZE);
    this.gl?.drawArrays(this.drawMode , 0, this.vertexCount);
  }

  static loadGrid(glContext: WebGLRenderingContext, incAxis: boolean) {
    //Dynamiclly create a grid
    let gl = glContext as WebGLRenderingContext;
    let verts = [],
      size = 2, // W/H of the outer box of the grid, from origin we can only go 1 unit in each direction, so from left to right is 2 units max
      div = 10.0, // How to divide up the grid
      step = size / div, // Steps between each line, just a number we increment by for each line in the grid.
      half = size / 2; // From origin the starting position is half the size.

    let p; //Temp variable for position value.
    for (let i = 0; i <= div; i++) {
      //Vertical line
      p = -half + (i * step);
      verts.push(p); //x1
      verts.push(0); //y1 verts.push(half);
      verts.push(half); //z1 verts.push(0);
      verts.push(0); //c2

      verts.push(p); //x2
      verts.push(0); //y2 verts.push(-half);
      verts.push(-half); //z2 verts.push(0);	
      verts.push(0); //c2 verts.push(1);

      //Horizontal line
      p = half - (i * step);
      verts.push(-half); //x1
      verts.push(0); //y1 verts.push(p);
      verts.push(p); //z1 verts.push(0);
      verts.push(0); //c1

      verts.push(half); //x2
      verts.push(0); //y2 verts.push(p);
      verts.push(p); //z2 verts.push(0);
      verts.push(0); //c2 verts.push(1);
    }

    if (incAxis) {
      //x axis
      verts.push(-1.1); //x1
      verts.push(0); //y1
      verts.push(0); //z1
      verts.push(1); //c2

      verts.push(1.1); //x2
      verts.push(0); //y2
      verts.push(0); //z2
      verts.push(1); //c2

      //y axis
      verts.push(0); //x1
      verts.push(-1.1); //y1
      verts.push(0); //z1
      verts.push(2); //c2

      verts.push(0); //x2
      verts.push(1.1); //y2
      verts.push(0); //z2
      verts.push(2); //c2

      //z axis
      verts.push(0); //x1
      verts.push(0); //y1
      verts.push(-1.1); //z1
      verts.push(3); //c2

      verts.push(0); //x2
      verts.push(0); //y2
      verts.push(1.1); //z2
      verts.push(3); //c2
    }

    const grid = new GridAxis(gl, GLSetttings.GRID_VERTEX_LEN, verts);

    return grid;
  }
}

export {
  GridAxis
}