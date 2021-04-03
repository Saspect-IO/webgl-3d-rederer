import { ProgramEntrySettings } from "@/modules";
import ShaderProgram from "./shaderProgram";

class GridAxisShader extends ShaderProgram{
	constructor(gl: WebGLRenderingContext, pMatrix: Float32Array){

		super(gl,ProgramEntrySettings.PRIMITIVE_SHADER_VERTEX, ProgramEntrySettings.PRIMITIVE_SHADER_FRAGMENT);

		//Standrd Uniforms
		this.setPerspective(pMatrix);

		//Custom Uniforms 
		this.gridIndex = gl.getAttribLocation(this.shaderProgram as WebGLProgram , 'grid_position');
		this.colorIndex = gl.getAttribLocation(this.shaderProgram as WebGLProgram , 'grid_color');

	}


	setGridMatrix() {
		const gl = this.gl as WebGLRenderingContext
		const uColor	= gl.getUniformLocation(this.shaderProgram as WebGLProgram ,"uColor");
		gl.uniform3fv(uColor, new Float32Array([ 0.8,0.8,0.8,  1,0,0,  0,1,0,  0,0,1 ]));
		//Cleanup
		gl.useProgram(null);
		return this;
	}

}

export {
    GridAxisShader
}