import { Camera } from "@/core/camera";
import { GLSetttings } from "@/modules";
import ShaderProgram from "../../shaderProgram";

class InfiniteGridShader{
	constructor(gl: WebGLRenderingContext, camera: Camera){
			
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

        this.perspectiveMatrixLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_PERSPECTIV_MAT) as WebGLUniformLocation
        this.cameraMatrixLoc = gl.getUniformLocation(shaderProgram.program as WebGLProgram, GLSetttings.UNI_CAMERA_MAT) as WebGLUniformLocation
        //Cleanup
        shaderProgram.deactivateShader()

		this.perspectiveProjectionMatrix = camera.perspectiveProjection
		this.viewModelMatrix = camera.viewMatrix
		this.shaderProgram = shaderProgram
	}

	perspectiveMatrixLoc: WebGLUniformLocation
	cameraMatrixLoc: WebGLUniformLocation

    perspectiveProjectionMatrix: Float32Array
	viewModelMatrix:Float32Array

    shaderProgram: ShaderProgram


    setUniforms(gl:WebGLRenderingContext) {
		this.shaderProgram.activateShader()
		gl.uniformMatrix4fv(this.perspectiveMatrixLoc, false, this.perspectiveProjectionMatrix)
		gl.uniformMatrix4fv(this.cameraMatrixLoc , false, this.viewModelMatrix )

		return this
  }
}

export {
    InfiniteGridShader
}