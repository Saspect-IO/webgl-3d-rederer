import Geometry from '../../geometry';
import Texture from '../../Textures/texture';
import Vbuffer from '../../vbuffer';
import ShaderProgram from '../../shaderProgram';
import ObjLoader from '../../objLoader';
import { MeshData } from '@/entities';
import { GLSetttings } from '@/modules';
import { Camera } from '../../camera';
import { Matrix4 } from '../../math';

class FloorQuadShader{
	constructor(gl: WebGLRenderingContext, camera:Camera, lightViewCamera:Camera){	
		const vertexShader = `#version 300 es
            layout(location=5) in vec3 a_position;
			layout(location=6) in vec3 a_norm;
			layout(location=4) in float a_color;

			uniform mat4 u_mVMatrix;
			uniform mat4 u_cameraMatrix;
			uniform mat4 u_pMatrix;
			uniform vec3 u_color[4];

			out lowp vec4 color;

			void main(void){

				color = vec4(u_color[ int(a_color) ],1.0);
				gl_Position = u_pMatrix * u_cameraMatrix * u_mVMatrix * vec4(a_position, 1.0);
			}`;

		const fragmentShader = `#version 300 es
			precision mediump float;
			in vec4 color;
			out vec4 finalColor;

			void main(void){
				finalColor = color; 
			}`;										

		const shaderProgram = new ShaderProgram(gl, vertexShader, fragmentShader);

		shaderProgram.activateShader()

		this.positionLoc = gl.getAttribLocation(shaderProgram.program as WebGLProgram, GLSetttings.ATTR_POSITION_NAME)
	
		this.modelViewMatrixLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_MODEL_MAT) as WebGLUniformLocation
		this.perspectiveMatrixLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_PERSPECTIV_MAT) as WebGLUniformLocation
		this.cameraMatrixLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_CAMERA_MAT) as WebGLUniformLocation
		this.uColorLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_COLOR) as WebGLUniformLocation
		//Cleanup
		shaderProgram.deactivateShader()
	
		this.perspectiveProjectionMatrix = camera.perspectiveProjection
		this.viewModelMatrix = camera.viewMatrix
		this.shaderProgram = shaderProgram
	
		}

		positionLoc: number


		modelViewMatrixLoc: WebGLUniformLocation
		perspectiveMatrixLoc: WebGLUniformLocation
		cameraMatrixLoc: WebGLUniformLocation
		uColorLoc: WebGLUniformLocation
	  
		perspectiveProjectionMatrix: Float32Array
		viewModelMatrix:Float32Array
	  
		shaderProgram: ShaderProgram
	  
	  
		setUniforms(gl:WebGLRenderingContext, model: Geometry) {
			this.shaderProgram.activateShader()
			gl.uniformMatrix4fv(this.perspectiveMatrixLoc, false, this.perspectiveProjectionMatrix)
			gl.uniformMatrix4fv(this.cameraMatrixLoc , false, this.viewModelMatrix )
		  	gl.uniform3fv(this.uColorLoc, new Float32Array([ 0.8,0.8,0.8,  1,0,0,  0,1,0,  0,0,1 ]))
		  	gl.uniformMatrix4fv(this.modelViewMatrixLoc, false, model.transform.getModelMatrix())

			return this
		}

}


class FloorQuad {

  constructor() {}

   static createGeometry(gl: WebGLRenderingContext, shaderProgram: FloorQuadShader){ 
    return new Geometry( FloorQuad.createMesh(gl, shaderProgram)); 
  }

   static createMesh(gl: WebGLRenderingContext, shaderProgram: FloorQuadShader) {

	const verts = [
        -1,0.002,1,
		1,0.002,1,
		1,0.002,-1,
		-1,0.002,1,
		1,0.002,-1,
		-1,0.002,-1,
    ]
    
    const vertexCount = verts.length/3;
	const strideLen = Float32Array.BYTES_PER_ELEMENT * 3; //Stride Length is the Vertex Size for the buffer in Bytes
    const mesh: MeshData = {
      positions : new Vbuffer(gl, verts, vertexCount, GLSetttings.BUFFER_TYPE_VERTICES),
      drawMode : gl.TRIANGLES,
      vertexCount,
    }

	mesh.positions?.bindToAttribute(shaderProgram.positionLoc as number, strideLen, GLSetttings.DEFAULT_OFFSET, GLSetttings.GRID_VECTOR_SIZE)
    return mesh;
  }

}

export {
	FloorQuadShader,
	FloorQuad
}