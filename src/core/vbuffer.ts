import { GLSetttings } from "@/modules";

export default class Vbuffer {

  constructor(gl: WebGLRenderingContext, data: number[], count: number, type:string) {
    this.buffer = gl.createBuffer() as WebGLBuffer;

    switch (type) {
      case GLSetttings.BUFFER_TYPE_ARRAY:
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
        break;

      case GLSetttings.BUFFER_TYPE_ELEMENT_ARRAY:
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

  bindToAttribute(data: number|number[], stride: number, offset: number, size: number = this.size, type:string = GLSetttings.BUFFER_TYPE_VERTICES) {
    const gl = this.gl
    switch (type) {
      case GLSetttings.BUFFER_TYPE_ARRAY:
        gl.enableVertexAttribArray(data as number);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.vertexAttribPointer(data as number, size, gl.FLOAT, false, stride, offset);
        gl.bindBuffer(gl.ARRAY_BUFFER,null);
        break;

      case GLSetttings.BUFFER_TYPE_ELEMENT_ARRAY:
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data as number[]), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);
        break;
    
      default:
        gl.enableVertexAttribArray(data as number);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.vertexAttribPointer(data as number, size, gl.FLOAT, false, stride, offset);
        gl.bindBuffer(gl.ARRAY_BUFFER,null);
        break;
    }
  }



}