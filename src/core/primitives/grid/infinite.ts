import Geometry from '../../geometry';
import Vbuffer from '../../vbuffer';
import ShaderProgram from '../../shaderProgram';
import { MeshData } from '@/entities';
import { GLSetttings } from '@/modules';
import { Camera } from '../../camera';

class InfiniteGridShader{
	constructor(gl: WebGLRenderingContext, camera:Camera, lightViewCamera:Camera){	
		const vertexShader = `#version 300 es
            layout(location=5) in vec3 a_position;

			uniform mat4 u_mVMatrix;
			uniform mat4 u_cameraViewMatrix;
			uniform mat4 u_pMatrix;

			vec3 unprojectPoint(float x, float y, float z, mat4 view, mat4 projection) {
                mat4 viewInv = inverse(view);
                mat4 projInv = inverse(projection);
                vec4 unprojectedPoint =  viewInv * projInv * vec4(x, y, z, 1.0);
                return unprojectedPoint.xyz / unprojectedPoint.w;
            }

			out vec3 nearPoint;
			out vec3 farPoint;
			out mat4 fragView;
            out mat4 fragProj;

			out vec3 vertexPosition;

			void main(void){
				vec3 p = a_position;

				fragView = u_cameraViewMatrix;
                fragProj = u_pMatrix;
				nearPoint = unprojectPoint(p.x, p.y, 0.0, u_cameraViewMatrix, u_pMatrix).xyz;
				farPoint = unprojectPoint(p.x, p.y, 1.0, u_cameraViewMatrix, u_pMatrix).xyz;

				vertexPosition = p.xyz;
				gl_Position = vec4(p, 1.0);

			}`;

		const fragmentShader = `#version 300 es
			precision highp float;

			in vec3 vertexPosition;
			in vec3 nearPoint;
            in vec3 farPoint;
            in mat4 fragView;
            in mat4 fragProj;

			// computes Z-buffer depth value, and converts the range.
			float computeDepth(vec3 pos) {
				vec4 clip_space_pos = fragProj * fragView * vec4(pos.xyz, 1.0);
				float clip_space_depth = clip_space_pos.z / clip_space_pos.w;

				float far = gl_DepthRange.far;
				float near = gl_DepthRange.near;

				float depth = (((far-near) * clip_space_depth) + near + far) / 2.0;
				
				return depth;
			}

			vec4 grid(vec3 fragPos3D, float scale) {
                vec2 coord = fragPos3D.xz * scale;
                vec2 derivative = fwidth(coord);
                vec2 gridLines = abs(fract(coord - 0.5) - 0.5) / derivative;
                float line = min(gridLines.x, gridLines.y);
                float minimumz = min(derivative.y, 1.0);
                float minimumx = min(derivative.x, 1.0);
                vec4 color = vec4(0.2, 0.2, 0.2, 1.0 - min(line, 1.0));
                // z axis
                if(fragPos3D.x > -0.1 * minimumx && fragPos3D.x < 0.1 * minimumx)
                    color.z = 1.0;
                // x axis
                if(fragPos3D.z > -0.1 * minimumz && fragPos3D.z < 0.1 * minimumz)
                    color.x = 1.0;
                return color;
            }

            out vec4 finalColor;

			void main(void){

                float t = -nearPoint.y / (farPoint.y - nearPoint.y);
                vec3 fragPos3D = nearPoint + t * (farPoint - nearPoint);

				gl_FragDepth = computeDepth(fragPos3D);

				float isIntersect = (t > 0.0) ? 1.0 : 0.0;
				float linearFieldSection = 0.02 * length(fragPos3D.xz);
				float fading = min(1.0, 1.5 - linearFieldSection);

				vec4 outColor = grid(fragPos3D, 0.5); 

				finalColor = outColor * isIntersect;
				finalColor *= fading;

			
            }`;										

		const shaderProgram = new ShaderProgram(gl, vertexShader, fragmentShader);

		shaderProgram.activateShader()

		this.positionLoc = gl.getAttribLocation(shaderProgram.program as WebGLProgram, GLSetttings.ATTR_POSITION_NAME)

		this.modelViewMatrixLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_MODEL_MAT) as WebGLUniformLocation
		this.perspectiveMatrixLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_PERSPECTIV_MAT) as WebGLUniformLocation
		this.cameraMatrixLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_CAMERA_MAT) as WebGLUniformLocation
		this.uColorLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_COLOR) as WebGLUniformLocation

		shaderProgram.deactivateShader()

		this.perspectiveProjectionMatrix = camera.perspectiveProjection
		this.orthoProjectionMatrix = camera.orthoProjection
		this.viewModelMatrix = camera.viewMatrix
		this.lightViewModelMatrix = lightViewCamera
		this.shaderProgram = shaderProgram
	}

	positionLoc: number
  
	modelViewMatrixLoc: WebGLUniformLocation
	perspectiveMatrixLoc: WebGLUniformLocation
	cameraMatrixLoc: WebGLUniformLocation

	uColorLoc: WebGLUniformLocation

	perspectiveProjectionMatrix: Float32Array
	orthoProjectionMatrix:Float32Array
	viewModelMatrix:Float32Array

	lightViewModelMatrix:Camera

	shaderProgram: ShaderProgram

	
	setUniforms(gl:WebGLRenderingContext, model: Geometry) {
		this.shaderProgram.activateShader()

		gl.uniformMatrix4fv(this.perspectiveMatrixLoc, false, this.perspectiveProjectionMatrix)
		gl.uniformMatrix4fv(this.cameraMatrixLoc , false, this.viewModelMatrix)
		gl.uniformMatrix4fv(this.modelViewMatrixLoc, false, model.transform.getModelMatrix())

		return this
    }
}


class InfiniteGrid {

  	constructor() {}

   	static async createGeometry(gl: WebGLRenderingContext, shaderProgram: InfiniteGridShader){ 
    	return  new Geometry( await InfiniteGrid.createMesh(gl, shaderProgram)); 
  	}

   static async createMesh(gl: WebGLRenderingContext, shaderProgram: InfiniteGridShader) {

		const verts = [
			1,-1,0,
			1,1,0,
			-1,-1,0,
			-1,1,0,
			-1,-1,0,
			1,1,0,
		]

		const vertexCount = verts.length/3;
		const strideLen = Float32Array.BYTES_PER_ELEMENT * 3; //Stride Length is the Vertex Size for the buffer in Bytes
		const mesh: MeshData = {
			positions : new Vbuffer(gl, verts, vertexCount, GLSetttings.BUFFER_TYPE_VERTICES),
			drawMode : gl.TRIANGLES,
			vertexCount,
		}

		mesh.positions?.bindToAttribute(shaderProgram.positionLoc as number, strideLen, GLSetttings.DEFAULT_OFFSET, GLSetttings.GRID_VECTOR_SIZE);

		return mesh;
  	}
}

export {
	InfiniteGridShader,
	InfiniteGrid
}