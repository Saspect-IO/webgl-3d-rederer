import { GLSetttings, ShaderProgramMatrixFields } from "@/modules"
import Geometry from "./geometry"

export default class ShaderProgram {
  constructor(gl: WebGLRenderingContext, vsSource: string, fsSource: string) {

    const vertexShader = this.createShader(gl, gl.VERTEX_SHADER, vsSource) as WebGLShader
    const fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, fsSource) as WebGLShader
    this.createShaderProgram(gl, fragmentShader, vertexShader)

    this.gl = gl

    if (this.shaderProgram ) {

      this.activateShader()

      //standard attribute locations
      this.positionLoc = gl.getAttribLocation(this.shaderProgram, GLSetttings.ATTR_POSITION_NAME)

      //standard uniform locations
      this.modelViewMatrix = gl.getUniformLocation(this.shaderProgram , GLSetttings.UNI_MODEL_MAT) as WebGLUniformLocation
      this.perspectiveMatrix = gl.getUniformLocation(this.shaderProgram, GLSetttings.UNI_PERSPECTIV_MAT) as WebGLUniformLocation
      this.cameraMatrix = gl.getUniformLocation(this.shaderProgram , GLSetttings.UNI_CAMERA_MAT) as WebGLUniformLocation

    }
  }

  gl: WebGLRenderingContext | null = null
  
  positionLoc: number | null = null
  normalLoc: number | null = null
  texCoordLoc: number | null = null

  modelViewMatrix: WebGLUniformLocation | null = null
  perspectiveMatrix: WebGLUniformLocation | null = null
  cameraMatrix: WebGLUniformLocation | null = null
  orthoMatrix: WebGLUniformLocation | null = null
  textureMatrix: WebGLUniformLocation | null = null
  diffuse: WebGLUniformLocation | null = null
  projectedTexture: WebGLUniformLocation | null = null
  ambientLightColor: WebGLUniformLocation | null = null
  lightDirection: WebGLUniformLocation | null = null
  lightPosition: WebGLUniformLocation | null = null
  cameraPosition: WebGLUniformLocation | null = null
  shininessLocation: WebGLUniformLocation | null = null
  lightColorLocation: WebGLUniformLocation | null = null 
  specularColorLocation: WebGLUniformLocation | null = null
  specularFactorLocation: WebGLUniformLocation | null = null 

  vertexShader: WebGLShader | null = null
  fragmentShader: WebGLShader | null = null
  shaderProgram: WebGLProgram | null = null


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

  createShaderProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): void {

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
    this.shaderProgram = program

    gl.detachShader(program, vertexShader)
    gl.detachShader(program, fragmentShader)
    gl.deleteShader(fragmentShader)
    gl.deleteShader(vertexShader)
  }

  activateShader() {
    (this.gl as WebGLRenderingContext).useProgram(this.shaderProgram)
    return this
  }

  deactivateShader() {
    (this.gl as WebGLRenderingContext).useProgram(null)
    return this
  }

  updateGPU(matrixData: Float32Array, uniformMatrix:string) {
    (this.gl as WebGLRenderingContext).uniformMatrix4fv( (this as { [key:string]: any} )[uniformMatrix]  as WebGLUniformLocation, false, matrixData)
    return this
  }

  dispose() {
    //unbind the program if its currently active
    if ((this.gl as WebGLRenderingContext).getParameter((this.gl as WebGLRenderingContext).CURRENT_PROGRAM) === this.shaderProgram) {
      this.deactivateShader()
    }
    (this.gl as WebGLRenderingContext).deleteProgram(this.shaderProgram)
  }


  // //Handle rendering a grid
  renderModel(model: Geometry) {
    const gl = this.gl as WebGLRenderingContext
		this.updateGPU(model.transform.getModelMatrix(), ShaderProgramMatrixFields.MODEL_MATRIX)	//Set the transform, so the shader knows where the model exists in 3d space

		if(model.mesh.noCulling) gl.disable(gl.CULL_FACE)
		if(model.mesh.doBlending) gl.enable(gl.BLEND)

		gl.drawArrays(model.mesh.drawMode, 0, model.mesh.vertexCount)

		//Cleanup
		if(model.mesh.noCulling) gl.enable(gl.CULL_FACE)
		if(model.mesh.doBlending) gl.disable(gl.BLEND)

		return this
  }

}