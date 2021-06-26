import { ShaderProgramMatrixFields } from "@/modules"
import Geometry from "./geometry"

export default class ShaderProgram {
  constructor(gl: WebGLRenderingContext, vsSource: string, fsSource: string) {

    const vertexShader = this.createShader(gl, gl.VERTEX_SHADER, vsSource) as WebGLShader
    const fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, fsSource) as WebGLShader
    const shaderProgram = this.createShaderProgram(gl, fragmentShader, vertexShader)
    this.program = shaderProgram
    this.gl = gl
  }

  gl: WebGLRenderingContext | null = null
  vertexShader: WebGLShader | null = null
  fragmentShader: WebGLShader | null = null
  program: WebGLProgram


  createShader(gl: WebGLRenderingContext, type: number, source: string) {
    const shader = gl.createShader(type) as WebGLShader

    // Send the source to the shader object
    gl.shaderSource(shader, source)

    // Compile the shader program
    gl.compileShader(shader)

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader))
      gl.deleteShader(shader)
      return null
    }

    return shader
  }

  createShaderProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {

    const program = gl.createProgram() as WebGLProgram

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Error creating shader program.", gl.getProgramInfoLog(program))
      gl.deleteProgram(program)
      throw new Error('Failed to link shaderProgram')
    }

    this.vertexShader = vertexShader
    this.fragmentShader = fragmentShader


    gl.detachShader(program, vertexShader)
    gl.detachShader(program, fragmentShader)
    gl.deleteShader(fragmentShader)
    gl.deleteShader(vertexShader)

    return program
  }

  activateShader() {
    (this.gl as WebGLRenderingContext).useProgram(this.program)
    return this
  }

  deactivateShader() {
    (this.gl as WebGLRenderingContext).useProgram(null)
    return this
  }

  dispose() {
    //unbind the program if its currently active
    if ((this.gl as WebGLRenderingContext).getParameter((this.gl as WebGLRenderingContext).CURRENT_PROGRAM) === this.program) {
      this.deactivateShader()
    }
    (this.gl as WebGLRenderingContext).deleteProgram(this.program)
  }

  renderModel(model: Geometry) {
    const gl = this.gl as WebGLRenderingContext
    
		if(model.mesh.noCulling) gl.disable(gl.CULL_FACE)
		if(model.mesh.doBlending) gl.enable(gl.BLEND)

		gl.drawArrays(model.mesh.drawMode, 0, model.mesh.vertexCount)

		//Cleanup
		if(model.mesh.noCulling) gl.enable(gl.CULL_FACE)
		if(model.mesh.doBlending) gl.disable(gl.BLEND)

		return this
  }

}