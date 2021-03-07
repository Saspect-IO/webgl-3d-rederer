export default class Vbuffer {

  constructor(gl: WebGLRenderingContext, vertexAttribute: number[], count: number) {
    // Creates buffer object in GPU RAM where we can store anything
    this.buffer = gl.createBuffer() as WebGLBuffer;
    // Tell which buffer object type we want to operate on
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    // Write the data, and set the flag to optimize
    // for rare changes to the data we're writing
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexAttribute), gl.STATIC_DRAW);
    this.gl = gl;
    this.size = vertexAttribute.length / count;
    this.count = count;
  }

  buffer: WebGLBuffer;
  gl: WebGLRenderingContext;
  size: number;
  count: number;

  destroy() {
    // Free memory that is occupied by our buffer object
    this.gl.deleteBuffer(this.buffer);
  }

  bindToAttribute(vertexAttributIndex: number) {
    const gl = this.gl
    // Tell which buffer object we want to operate on as a VBO
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)
    // Enable this vertexAttributIndex in the shader
    gl.enableVertexAttribArray(vertexAttributIndex)
    // Define format of the vertexAttributIndex array. Must match parameters in shader
    gl.vertexAttribPointer(vertexAttributIndex, this.size, gl.FLOAT, false, 0, 0)
  }

}