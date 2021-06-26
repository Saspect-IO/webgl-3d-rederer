import { MeshData } from "@/entities";
import { GLSetttings } from "@/modules";
import Geometry from "../../geometry";
import ShaderProgram from "../../shaderProgram";
import Vbuffer from "../../vbuffer";


class InfiniteGridShader{
	constructor(gl: WebGLRenderingContext, projectionMatrix: Float32Array){
			
		const vertexShader  = `#version 300 es

            uniform mat4 u_cameraMatrix;
            uniform mat4 u_pMatrix;
            uniform vec3 u_color[4];

			vec3 gridPlane[6] = vec3[](
                vec3(1, 1, 0), vec3(-1, -1, 0), vec3(-1, 1, 0),
                vec3(-1, -1, 0), vec3(1, 1, 0), vec3(1, -1, 0)
            );

            out vec3 nearPoint;
            out vec3 farPoint;

            out mat4 fragView;
            out mat4 fragProj;

            vec3 UnprojectPoint(float x, float y, float z, mat4 view, mat4 projection) {
                mat4 viewInv = inverse(view);
                mat4 projInv = inverse(projection);
                vec4 unprojectedPoint =  viewInv * projInv * vec4(x, y, z, 1.0);
                return unprojectedPoint.xyz / unprojectedPoint.w;
            }

			void main(void){
                vec3 p = gridPlane[gl_VertexID];

                fragView = u_cameraMatrix;
                fragProj = u_pMatrix;
                nearPoint = UnprojectPoint(p.x, p.y, 0.0, u_cameraMatrix, u_pMatrix).xyz; // unprojecting on the near plane
                farPoint = UnprojectPoint(p.x, p.y, 1.0, u_cameraMatrix, u_pMatrix).xyz; // unprojecting on the far plane
                gl_Position = vec4(p, 1.0); // using directly the clipped coordinates
			}`;

		const fragmentShader = `#version 300 es
			precision highp float;

            in vec3 nearPoint; // nearPoint calculated in vertex shader
            in vec3 farPoint; // farPoint calculated in vertex shader
            in mat4 fragView;
            in mat4 fragProj;

            vec4 grid(vec3 fragPos3D, float scale, bool drawAxis) {
                vec2 coord = fragPos3D.xz * scale; // use the scale variable to set the distance between the lines
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

            float computeDepth(vec3 pos) {
                vec4 clip_space_pos = fragProj * fragView * vec4(pos.xyz, 1.0);
                return (clip_space_pos.z / clip_space_pos.w);
            }

            out vec4 finalColor;
			void main(void){
                float t = -nearPoint.y / (farPoint.y - nearPoint.y);
                vec3 fragPos3D = nearPoint + t * (farPoint - nearPoint);

                float opacity = (t > 0.0) ? 1.0 : 0.0;

                gl_FragDepth = computeDepth(fragPos3D);
            
                finalColor = grid(fragPos3D, 10.0, true); 
            }`;


    const shaderProgram = new ShaderProgram(gl,vertexShader, fragmentShader)

    shaderProgram.activateShader()

    this.perspectiveMatrix = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_PERSPECTIV_MAT) as WebGLUniformLocation
    this.cameraMatrix = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_CAMERA_MAT) as WebGLUniformLocation

    shaderProgram.updateGPU(projectionMatrix, this.perspectiveMatrix)
    this.shaderProgram = shaderProgram

    //Cleanup
    shaderProgram.deactivateShader()

	}

  positionLoc: number | null = null
	texCoordLoc: number | null = null

  modelViewMatrix: WebGLUniformLocation | null = null
	perspectiveMatrix: WebGLUniformLocation | null = null
	cameraMatrix: WebGLUniformLocation | null = null

  shaderProgram: ShaderProgram | null = null
}

// class GridAxis {

//   constructor() {}
  
//   static createGeometry(gl:WebGLRenderingContext,shaderProgram: GridAxisShader, enableAxis: boolean){ 
//     return new Geometry(GridAxis.createMesh(gl, shaderProgram, enableAxis)); 
//   }


//   static createMesh(glContext: WebGLRenderingContext, shaderProgram: GridAxisShader, enableAxis: boolean ) {
//     //Dynamiclly create a grid
//     let gl = glContext as WebGLRenderingContext;
//     let verts = [],
//       size = 2, // W/H of the outer box of the grid, from origin we can only go 1 unit in each direction, so from left to right is 2 units max
//       div = 10.0, // How to divide up the grid
//       step = size / div, // Steps between each line, just a number we increment by for each line in the grid.
//       half = size / 2; // From origin the starting position is half the size.

//     let p; //Temp variable for position value.
//     for (let i = 0; i <= div; i++) {
//       //Vertical line
//       p = -half + (i * step);
//       verts.push(p); //x1
//       verts.push(0); //y1 verts.push(half);
//       verts.push(half); //z1 verts.push(0);
//       verts.push(0); //c2

//       verts.push(p); //x2
//       verts.push(0); //y2 verts.push(-half);
//       verts.push(-half); //z2 verts.push(0);	
//       verts.push(0); //c2 verts.push(1);

//       //Horizontal line
//       p = half - (i * step);
//       verts.push(-half); //x1
//       verts.push(0); //y1 verts.push(p);
//       verts.push(p); //z1 verts.push(0);
//       verts.push(0); //c1

//       verts.push(half); //x2
//       verts.push(0); //y2 verts.push(p);
//       verts.push(p); //z2 verts.push(0);
//       verts.push(0); //c2 verts.push(1);
//     }

//     if (enableAxis) {
//       //x axis
//       verts.push(-1.1); //x1
//       verts.push(0); //y1
//       verts.push(0); //z1
//       verts.push(1); //c2

//       verts.push(1.1); //x2
//       verts.push(0); //y2
//       verts.push(0); //z2
//       verts.push(1); //c2

//       //y axis
//       verts.push(0); //x1
//       verts.push(-1.1); //y1
//       verts.push(0); //z1
//       verts.push(2); //c2

//       verts.push(0); //x2
//       verts.push(1.1); //y2
//       verts.push(0); //z2
//       verts.push(2); //c2

//       //z axis
//       verts.push(0); //x1
//       verts.push(0); //y1
//       verts.push(-1.1); //z1
//       verts.push(3); //c2

//       verts.push(0); //x2
//       verts.push(0); //y2
//       verts.push(1.1); //z2
//       verts.push(3); //c2
//     }
//     const strideLen = Float32Array.BYTES_PER_ELEMENT * GLSetttings.GRID_VERTEX_LEN; //Stride Length is the Vertex Size for the buffer in Bytes
//     const vertexCount = verts.length / GLSetttings.GRID_VERTEX_LEN;

//     const mesh: MeshData = {
//       positions : new Vbuffer(gl, verts, vertexCount, GLSetttings.BUFFER_TYPE_VERTICES),
//       drawMode : gl.LINES,
//       vertexCount,
//     }

//     mesh.positions.bindToAttribute(shaderProgram.positionLoc as number, strideLen, GLSetttings.DEFAULT_OFFSET, GLSetttings.GRID_VECTOR_SIZE)

//     return mesh;
//   }
// }

export {
    InfiniteGridShader,
    // GridAxis
}