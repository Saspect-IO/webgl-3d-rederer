import { MeshData } from "@/entities";
import { GLSetttings, ShaderProgramMatrixFields } from "@/modules";
import Geometry from "../../geometry";
import ShaderProgram from "../../shaderProgram";
import Vbuffer from "../../vbuffer";


class QuadShader{
	constructor(gl: WebGLRenderingContext, projectionMatrix: Float32Array){
			
		const vertexShader  = '#version 300 es\n' +
			'in vec3 a_position;' +
			'in float a_color;' +
      'in vec2 a_texCoord;'+

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
        'void main(void){'+
          'finalColor = color;'+ 
        '}';

      const program = new ShaderProgram(gl,vertexShader, fragmentShader)

      program.activateShader()
  
      this.positionLoc = gl.getAttribLocation(program, GLSetttings.ATTR_POSITION_NAME)
      this.texCoordLoc = gl.getAttribLocation(program as WebGLProgram , GLSetttings.ATTR_UV_NAME)


      this.modelViewMatrix = gl.getUniformLocation(program , GLSetttings.UNI_MODEL_MAT) as WebGLUniformLocation
      this.perspectiveMatrix = gl.getUniformLocation(program, GLSetttings.UNI_PERSPECTIV_MAT) as WebGLUniformLocation
      this.cameraMatrix = gl.getUniformLocation(program , GLSetttings.UNI_CAMERA_MAT) as WebGLUniformLocation
  
      program.updateGPU(projectionMatrix, ShaderProgramMatrixFields.PERSPECTIVE_MATRIX)
      const uColor = gl.getUniformLocation(program as WebGLProgram ,GLSetttings.UNI_COLOR)
      gl.uniform3fv(uColor, new Float32Array([ 0.8,0.8,0.8,  1,0,0,  0,1,0,  0,0,1 ]))
  
      //Cleanup
      program.deactivateShader()

	}

  positionLoc: number
  texCoordLoc: number

  modelViewMatrix: WebGLUniformLocation
	perspectiveMatrix: WebGLUniformLocation
	cameraMatrix: WebGLUniformLocation
}

class Quad {

  constructor() {}
  
  static createGeometry(gl:WebGLRenderingContext,shaderProgram: QuadShader, enableAxis: boolean){ 
    return new Geometry(Quad.createMesh(gl, shaderProgram, enableAxis)); 
  }

  static createMesh(glContext: WebGLRenderingContext, shaderProgram: QuadShader, enableAxis: boolean = false ) {
    //Dynamiclly create a quad
    let gl = glContext as WebGLRenderingContext;
    let verts = [ 0,0,0, 1,0,0, 1,0,1, 0,0,0 ],
    uvs = [ 0,0, 0,1, 1,1, 1,0 ],
    indices = [ 0,1,3, 1,2,3 ]

    const strideLen = Float32Array.BYTES_PER_ELEMENT * GLSetttings.GRID_VERTEX_LEN; //Stride Length is the Vertex Size for the buffer in Bytes
    const offset = Float32Array.BYTES_PER_ELEMENT * GLSetttings.GRID_VECTOR_SIZE;
    const vertexCount = verts.length / GLSetttings.GRID_VERTEX_LEN;

    const mesh: MeshData = {
      positions: new Vbuffer(gl, verts, vertexCount).storeVertices(),
      drawMode: gl.TRIANGLES,
      uvs: new Vbuffer(gl, uvs, vertexCount).storeVertices(),
      indices: new Vbuffer(gl, indices, vertexCount).storeIndices(),
      vertexCount,
      noCulling: true,
      doBlending: true,
    }
    
    
    mesh.positions.bindToAttribute(shaderProgram.positionLoc as number, GLSetttings.DEFAULT_STRIDE, GLSetttings.DEFAULT_OFFSET)
    mesh.uvs?.bindToAttribute(shaderProgram.texCoordLoc as number, GLSetttings.DEFAULT_STRIDE, GLSetttings.DEFAULT_OFFSET)


    return mesh;
  }
}

export {
  QuadShader,
  Quad
}