export default class Vbuffer {

  constructor(gl: WebGLRenderingContext, data: number[], count: number) {
    this.buffer = gl.createBuffer() as WebGLBuffer;
    this.gl = gl;
    this.size = data.length / count;
    this.data = data
  }

  buffer: WebGLBuffer;
  gl: WebGLRenderingContext;
  size: number;
  data: number[];

  destroy() {
    this.gl.deleteBuffer(this.buffer);
  }

  storeVertices(){
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.data), this.gl.STATIC_DRAW);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    return this
  }

  storeIndices(){
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffer);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.data), this.gl.STATIC_DRAW);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    return this
  }

  bindToAttribute(vertexAttributeIndex: number, stride: number, offset: number, size: number = this.size) {
    const gl = this.gl
    gl.enableVertexAttribArray(vertexAttributeIndex);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.vertexAttribPointer(vertexAttributeIndex, size, gl.FLOAT, false, stride, offset);
		gl.bindBuffer(gl.ARRAY_BUFFER,null);
  }

}