import { MeshData } from "@/entities";
import { GLSetttings } from "../modules";
import Geometry from "./geometry";
import ShaderProgram from "./shaderProgram";
import Vbuffer from "./vbuffer";
class GridAxis {

  constructor() {}

  static createModel(gl:WebGLRenderingContext, shaderProgram:ShaderProgram, enableAxis: boolean){ 
    return new Geometry(GridAxis.createMesh(gl, shaderProgram, enableAxis)); 
  }

  //https://github.com/sketchpunk/FunWithWebGL2/tree/master/lesson_006
  static createMesh(glContext: WebGLRenderingContext, shaderProgram: ShaderProgram, enableAxis: boolean ) {
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

    if (enableAxis) {
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
    const strideLen = Float32Array.BYTES_PER_ELEMENT * GLSetttings.GRID_VERTEX_LEN; //Stride Length is the Vertex Size for the buffer in Bytes
    const offset = Float32Array.BYTES_PER_ELEMENT * GLSetttings.GRID_VECTOR_SIZE;
    const vertexCount = verts.length / GLSetttings.GRID_VERTEX_LEN;

    const mesh: MeshData = {
      positions : new Vbuffer(gl, verts, vertexCount),
      drawMode : gl.LINES
    }

    mesh.positions.bindToAttribute(shaderProgram.gridIndex as number, strideLen, GLSetttings.DEFAULT_OFFSET, GLSetttings.GRID_VECTOR_SIZE);
    mesh.positions.bindToAttribute(shaderProgram.colorIndex as number, strideLen, offset, GLSetttings.GRID_COLOR_SIZE);

    return mesh;
  }
}

export {
  GridAxis
}