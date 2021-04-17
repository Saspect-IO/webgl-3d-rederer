export default class Vbuffer {

  constructor(gl: WebGLRenderingContext, vertexAttribute: number[], count: number) {
    this.buffer = gl.createBuffer() as WebGLBuffer;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexAttribute), gl.STATIC_DRAW);
    this.gl = gl;
    this.size = vertexAttribute.length / count;
  }

  buffer: WebGLBuffer;
  gl: WebGLRenderingContext;
  size: number;

  destroy() {
    this.gl.deleteBuffer(this.buffer);
  }

  bindToAttribute(vertexAttributeIndex: number, stride: number, offset: number, size: number = this.size) {
    const gl = this.gl
    gl.enableVertexAttribArray(vertexAttributeIndex);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.vertexAttribPointer(vertexAttributeIndex, size, gl.FLOAT, false, stride, offset);
		gl.bindBuffer(gl.ARRAY_BUFFER,null);
  }

}