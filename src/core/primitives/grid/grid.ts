import { MeshData } from "@/entities";
import { GLSetttings, ShaderProgramMatrixFields } from "@/modules";
import Geometry from "../../geometry";
import ShaderProgram from "../../shaderProgram";
import Vbuffer from "../../vbuffer";


class GridAxisShader extends ShaderProgram{
	constructor(gl: WebGLRenderingContext, projectionMatrix: Float32Array){
			
		const vertexShader  = '#version 300 es\n' +
			'layout(location=4) in vec3 a_position;' +
			'layout(location=5) in float a_color;' +

			'uniform mat4 u_mVMatrix;'+	
			'uniform mat4 u_cameraMatrix;'+
			'uniform mat4 u_pMatrix;'+
			'uniform vec3 u_color[4];' +

			'out lowp vec4 color;' +
			'void main(void){' +
				'color = vec4(u_color[ int(a_color) ],1.0);' +
				'gl_Position = u_pMatrix * u_cameraMatrix * u_mVMatrix * vec4(a_position, 1.0);' +
			'}';
		const fragmentShader = '#version 300 es\n' +
			'precision mediump float;' +
			'in vec4 color;' +
			'out vec4 finalColor;' +
			'void main(void){ finalColor = color; }';

		super(gl, vertexShader, fragmentShader);

		//Custom Uniforms 

    this.updateGPU(projectionMatrix, ShaderProgramMatrixFields.PERSPECTIVE_MATRIX);
		const uColor = gl.getUniformLocation(this.shaderProgram as WebGLProgram ,"u_color");
		gl.uniform3fv(uColor, new Float32Array([ 0.8,0.8,0.8,  1,0,0,  0,1,0,  0,0,1 ]));

		//Cleanup
		this.deactivateShader();

	}
}

class GridAxis {

  constructor() {}
  
  static createGeometry(gl:WebGLRenderingContext, enableAxis: boolean){ 
    return new Geometry(GridAxis.createMesh(gl, enableAxis)); 
  }

  //https://github.com/sketchpunk/FunWithWebGL2/tree/master/lesson_006
  static createMesh(glContext: WebGLRenderingContext, enableAxis: boolean ) {
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
      positions : new Vbuffer(gl, verts, vertexCount).storeVertices(),
      drawMode : gl.LINES,
      vertexCount,
    }

    mesh.positions.bindToAttribute(GLSetttings.ATTR_GRID_POSITION_LOC as number, strideLen, GLSetttings.DEFAULT_OFFSET, GLSetttings.GRID_VECTOR_SIZE);
    mesh.positions.bindToAttribute(GLSetttings.ATTR_GRID_COLOR_LOC as number, strideLen, offset, GLSetttings.GRID_COLOR_SIZE);

    return mesh;
  }
}

export {
  GridAxisShader,
  GridAxis
}