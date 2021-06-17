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
      this.positionIndex = gl.getAttribLocation(this.shaderProgram as WebGLProgram , GLSetttings.ATTR_POSITION_NAME)
      this.normalIndex = gl.getAttribLocation(this.shaderProgram as WebGLProgram , GLSetttings.ATTR_NORMAL_NAME)
      this.uvIndex = gl.getAttribLocation(this.shaderProgram as WebGLProgram , GLSetttings.ATTR_UV_NAME)

      //standard uniform locations
      this.modelViewMatrix = gl.getUniformLocation(this.shaderProgram , GLSetttings.UNI_MODEL_MAT) as WebGLUniformLocation
      this.perspectiveMatrix = gl.getUniformLocation(this.shaderProgram , GLSetttings.UNI_PERSPECTIV_MAT) as WebGLUniformLocation
      this.cameraMatrix = gl.getUniformLocation(this.shaderProgram , GLSetttings.UNI_CAMERA_MAT) as WebGLUniformLocation
      this.mainTexture = gl.getUniformLocation(this.shaderProgram as WebGLProgram , GLSetttings.UNI_TEXTURE_MAT) as WebGLUniformLocation
      // this.ambientLight = gl.getUniformLocation(this.shaderProgram as WebGLProgram , GLSetttings.UNI_LIGHT_AMBIENT) as WebGLUniformLocation
		  // this.lightDirection = gl.getUniformLocation(this.shaderProgram as WebGLProgram , GLSetttings.UNI_LIGHT_DIRECTION) as WebGLUniformLocation
      this.lightPosition = gl.getUniformLocation(this.shaderProgram as WebGLProgram , GLSetttings.UNI_LIGHT_POSITION) as WebGLUniformLocation
      this.cameraPosition = gl.getUniformLocation(this.shaderProgram as WebGLProgram , GLSetttings.UNI_CAMERA_POSITION) as WebGLUniformLocation
      this.shininess = gl.getUniformLocation(this.shaderProgram as WebGLProgram , GLSetttings.UNI_CAMERA_SHININESS) as WebGLUniformLocation
    }
  }

  gl: WebGLRenderingContext | null = null
  
  positionIndex: number | null = null
  normalIndex: number | null = null
  uvIndex: number | null = null

  modelViewMatrix: WebGLUniformLocation | null = null
  perspectiveMatrix: WebGLUniformLocation | null = null
  cameraMatrix: WebGLUniformLocation | null = null
  mainTexture: WebGLUniformLocation | null = null
  ambientLight: WebGLUniformLocation | null = null
  lightDirection: WebGLUniformLocation | null = null
  lightPosition: WebGLUniformLocation | null = null
  cameraPosition: WebGLUniformLocation | null = null
  shininess: WebGLUniformLocation | null = null

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