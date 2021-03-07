export default class Vbuffer{

    constructor(gl: WebGLRenderingContext, data, count){
        // Creates buffer object in GPU RAM where we can store anything
        this.bufferObject = gl.createBuffer()
        // Tell which buffer object we want to operate on as a VBO
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferObject)
        // Write the data, and set the flag to optimize
        // for rare changes to the data we're writing
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW)
        this.gl = gl
        this.size = data.length / count
        this.count = count
        this.data = this.bufferObject
    }
    
    bufferObject;
    gl;
    size;
    count;
    data;

    destroy() {
        // Free memory that is occupied by our buffer object
        this.gl.deleteBuffer(this.data)
      }
      
    bindToAttribute(attribute) {
        var gl = this.gl
        // Tell which buffer object we want to operate on as a VBO
        gl.bindBuffer(gl.ARRAY_BUFFER, this.data)
        // Enable this attribute in the shader
        gl.enableVertexAttribArray(attribute)
        // Define format of the attribute array. Must match parameters in shader
        gl.vertexAttribPointer(attribute, this.size, gl.FLOAT, false, 0, 0)
      }
}