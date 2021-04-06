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
  }

  buffer: WebGLBuffer;
  gl: WebGLRenderingContext;
  size: number;

  destroy() {
    // Free memory that is occupied by our buffer object
    this.gl.deleteBuffer(this.buffer);
  }

  bindToAttribute(vertexAttributeIndex: number, stride: number, offset: number, size: number = this.size) {

    const gl = this.gl
    // Turn on the vertex attribute
    gl.enableVertexAttribArray(vertexAttributeIndex);
    // Bind the vertex buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

    // Tell the vertex attribute how to get data out of vertexBuffer (ARRAY_BUFFER)
    gl.vertexAttribPointer(vertexAttributeIndex, size, gl.FLOAT, false, stride, offset);

    //Cleanup and Finalize
		gl.bindBuffer(gl.ARRAY_BUFFER,null);
  }

}