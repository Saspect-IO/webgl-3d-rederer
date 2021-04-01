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
    // Turn on the vertex attribute
    gl.enableVertexAttribArray(vertexAttributIndex);
    // Bind the vertex buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

    const stride = 0;// 0 = move forward size * sizeof(type) each iteration to get the next vertex
    const offset = 0;// start at the beginning of the buffer

    // Tell the vertex attribute how to get data out of vertexBuffer (ARRAY_BUFFER)
    gl.vertexAttribPointer(vertexAttributIndex, this.size, gl.FLOAT, false, stride, offset);
  }

}