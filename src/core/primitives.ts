import { GLSetttings } from "../modules";
import Modal from "./modal";
class GridAxis {

  static createModal(glContext: WebGLRenderingContext, incAxis:boolean) {
    return new Modal(GridAxis.createMesh(glContext, incAxis));
  }

  static createMesh(glContext: WebGLRenderingContext, incAxis:boolean) {
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


    //Setup
    let attrColorLoc = 4,
      strideLen,
      mesh: any = {
        drawMode: gl.LINES,
      };

    //Do some math
    mesh.vertexComponentLen = 4;
    mesh.vertexCount = verts.length / mesh.vertexComponentLen;
    strideLen = Float32Array.BYTES_PER_ELEMENT * mesh.vertexComponentLen; //Stride Length is the Vertex Size for the buffer in Bytes

    //Setup our Buffer
    mesh.bufVertices = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.bufVertices);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(GLSetttings.ATTR_POSITION_LOC);
    gl.enableVertexAttribArray(attrColorLoc);

    gl.vertexAttribPointer(
      GLSetttings.ATTR_POSITION_LOC //Attribute Location
      , 3 //How big is the vector by number count
      , gl.FLOAT //What type of number we passing in
      , false //Does it need to be normalized?
      , strideLen //How big is a vertex chunk of data.
      , 0 //Offset by how much
    );

    gl.vertexAttribPointer(
      attrColorLoc //new shader has "in float a_color" as the second attrib
      , 1 //This atttrib is just a singlgle float
      , gl.FLOAT, false, strideLen //Each vertex chunk is 4 floats long
      , Float32Array.BYTES_PER_ELEMENT * 3 //skip first 3 floats in our vertex chunk, its like str.substr(3,1) in theory.
    );

    //Cleanup and Finalize
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return mesh;
  }
}

export{
  GridAxis
}