export default class Vbuffer {

  constructor(glContext: WebGLRenderingContext, vertexAttribute: number[], count: number) {
    // Creates buffer object in GPU RAM where we can store anything
    this.buffer = glContext.createBuffer() as WebGLBuffer;
    // Tell which buffer object type we want to operate on
    glContext.bindBuffer(glContext.ARRAY_BUFFER, this.buffer);
    // Write the data, and set the flag to optimize
    // for rare changes to the data we're writing
    glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(vertexAttribute), glContext.STATIC_DRAW);
    this.glContext = glContext;
    this.size = vertexAttribute.length / count;
    this.count = count;
  }

  buffer: WebGLBuffer;
  glContext: WebGLRenderingContext;
  size: number;
  count: number;

  destroy() {
    // Free memory that is occupied by our buffer object
    this.glContext.deleteBuffer(this.buffer);
  }

  bindToAttribute(vertexAttributIndex: number) {
    const glContext = this.glContext
    // Tell which buffer object we want to operate on as a VBO
    glContext.bindBuffer(glContext.ARRAY_BUFFER, this.buffer)
    // Enable this vertexAttributIndex in the shader
    glContext.enableVertexAttribArray(vertexAttributIndex)
    // Define format of the vertexAttributIndex array. Must match parameters in shader
    glContext.vertexAttribPointer(vertexAttributIndex, this.size, glContext.FLOAT, false, 0, 0)
  }

}