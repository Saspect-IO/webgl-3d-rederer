import { MeshData } from "@/entities";
import { GLSetttings } from "@/modules";
import Geometry from "../../geometry";
import ShaderProgram from "../../shaderProgram";
import Vbuffer from "../../vbuffer";


class QuadShader{
	constructor(gl: WebGLRenderingContext, projectionMatrix: Float32Array){
			
		const vertexShader  = '#version 300 es\n' +
			'layout(location=5) in vec3 a_position;' +
      'layout(location=6) in vec2 a_texCoord;'+

			'uniform mat4 u_mVMatrix;'+	
			'uniform mat4 u_cameraMatrix;'+
			'uniform mat4 u_pMatrix;'+


      'out vec2 v_texCoord;'+
			'void main(void){' +
        'v_texCoord = a_texCoord;'+
				'gl_Position = u_pMatrix * u_cameraMatrix * u_mVMatrix * vec4(a_position, 1.0);' +
			'}';
      const fragmentShader = '#version 300 es\n' +
        'precision mediump float;' +
        'in vec2 v_texCoord;'+

        'out vec4 finalColor;' +
        'void main(void){'+

          'float outColor = (v_texCoord.x <= 0.1 || v_texCoord.x >=0.9 || v_texCoord.y <= 0.1 || v_texCoord.y >= 0.9)? 0.0 : 1.0;'+
          'finalColor = vec4(outColor);'+ 
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
  
  static createGeometry(gl:WebGLRenderingContext,shaderProgram: QuadShader){ 
    return new Geometry(Quad.createMesh(gl, shaderProgram)); 
  }

  static createMesh(glContext: WebGLRenderingContext, shaderProgram: QuadShader ) {
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
    mesh.indices?.bindToAttribute(indices, GLSetttings.DEFAULT_STRIDE, GLSetttings.DEFAULT_OFFSET, 0, GLSetttings.BUFFER_TYPE_INDICES)


    return mesh;
  }
}

export {
  QuadShader,
  Quad
}