import { MeshData } from "@/entities";
import { GLSetttings, ShaderProgramMatrixFields } from "@/modules";
import Geometry from "../../geometry";
import ShaderProgram from "../../shaderProgram";
import Vbuffer from "../../vbuffer";


class QuadShader{
	constructor(gl: WebGLRenderingContext, projectionMatrix: Float32Array){
			
		const vertexShader  = '#version 300 es\n' +
			'layout(location=6) in vec3 a_position;' +
			'layout(location=7) in float a_color;' +
      'layout(location=8) in vec2 a_texCoord;'+

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

      const shaderProgram = new ShaderProgram(gl, vertexShader, fragmentShader)

      if (shaderProgram) {
        shaderProgram.activateShader()
  
        this.positionLoc = gl.getAttribLocation(shaderProgram.program as WebGLProgram, GLSetttings.ATTR_POSITION_NAME)
        this.texCoordLoc = gl.getAttribLocation(shaderProgram.program as WebGLProgram, GLSetttings.ATTR_UV_NAME)
  
        this.modelViewMatrix = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_MODEL_MAT) as WebGLUniformLocation
        this.perspectiveMatrix = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_PERSPECTIV_MAT) as WebGLUniformLocation
        this.cameraMatrix = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_CAMERA_MAT) as WebGLUniformLocation
    
        shaderProgram.updateGPU(projectionMatrix, this.perspectiveMatrix)
        const uColor = gl.getUniformLocation(shaderProgram.program as WebGLProgram ,GLSetttings.UNI_COLOR)
        gl.uniform3fv(uColor, new Float32Array([ 0.8,0.8,0.8,  1,0,0,  0,1,0,  0,0,1 ]))
    
        this.shaderProgram = shaderProgram

        //Cleanup
        shaderProgram.deactivateShader()
      }



	}

  positionLoc: number | null = null
  texCoordLoc: number | null = null

  modelViewMatrix: WebGLUniformLocation | null = null
	perspectiveMatrix: WebGLUniformLocation | null = null
	cameraMatrix: WebGLUniformLocation | null = null

  shaderProgram: ShaderProgram | null = null
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
      positions: new Vbuffer(gl, verts, vertexCount, GLSetttings.BUFFER_TYPE_VERTICES),
      drawMode: gl.TRIANGLES,
      uvs: new Vbuffer(gl, uvs, vertexCount, GLSetttings.BUFFER_TYPE_VERTICES),
      indices: new Vbuffer(gl, indices, vertexCount, GLSetttings.BUFFER_TYPE_INDICES),
      vertexCount,
      noCulling: true,
      doBlending: true,
    }
    
    mesh.positions.bindToAttribute(shaderProgram.positionLoc as number, strideLen, GLSetttings.DEFAULT_OFFSET, GLSetttings.GRID_VECTOR_SIZE)
    mesh.uvs?.bindToAttribute(shaderProgram.texCoordLoc as number, strideLen, offset, GLSetttings.GRID_COLOR_SIZE)


    return mesh;
  }
}

export {
  QuadShader,
  Quad
}