import { GLSetttings } from "@/modules";

export default class Vbuffer {

  constructor(gl: WebGLRenderingContext, data: number[], count: number, type:string) {
    this.buffer = gl.createBuffer() as WebGLBuffer;

    switch (type) {
      case GLSetttings.BUFFER_TYPE_VERTICES:
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
        break;

        case GLSetttings.BUFFER_TYPE_INDICES:
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);
        break;
    
      default:
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
        break;
    }


    this.gl = gl;
    this.size = data.length / count;
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