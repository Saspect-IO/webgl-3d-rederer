export default class ShaderProgram {
  constructor(gl: WebGLRenderingContext, vsSource: string, fsSource: string) {

    const vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vsSource) as WebGLShader;
    const fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fsSource) as WebGLShader;

    // Create the shader program
    const shaderProgram = gl.createProgram() as WebGLProgram;
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(shaderProgram));
      throw new Error('Failed to link shaderProgram');
    }

    this.gl = gl;
    this.positionIndex = gl.getAttribLocation(shaderProgram, 'position');
    this.normalIndex = gl.getAttribLocation(shaderProgram, 'normal');
    this.uvIndex = gl.getAttribLocation(shaderProgram, 'uv');
    this.model = gl.getUniformLocation(shaderProgram, 'model') as WebGLUniformLocation;
    this.view = gl.getUniformLocation(shaderProgram, 'view') as WebGLUniformLocation;
    this.projection = gl.getUniformLocation(shaderProgram, 'projection') as WebGLUniformLocation;
    this.ambientLight = gl.getUniformLocation(shaderProgram, 'ambientLight') as WebGLUniformLocation;
    this.lightDirection = gl.getUniformLocation(shaderProgram, 'lightDirection') as WebGLUniformLocation;
    this.diffuse = gl.getUniformLocation(shaderProgram, 'diffuse') as WebGLUniformLocation;
    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;
    this.shaderProgram = shaderProgram;

  }

  gl: WebGLRenderingContext;
  positionIndex: number;
  normalIndex: number;
  uvIndex: number;
  model: WebGLUniformLocation;
  diffuse: WebGLUniformLocation;
  view: WebGLUniformLocation;
  projection: WebGLUniformLocation;
  ambientLight: WebGLUniformLocation;
  lightDirection: WebGLUniformLocation;
  vertexShader: WebGLShader;
  fragmentShader: WebGLShader;
  shaderProgram: WebGLProgram;


  // Loads shader files from the given URLs, and returns a program as a promise
  static async initShaderProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string) {

    const loadFile = async (src: string) => {
      const response = await fetch(src);
      const data = await response.text();
      return data;
    }
    const files = await Promise.all([loadFile(vsSource), loadFile(fsSource)]);
    const shaderProgram = new ShaderProgram(gl, files[0] as string, files[1] as string);

    return shaderProgram
  }

  loadShader(gl: WebGLRenderingContext, type: number, source: string) {
    const shader = gl.createShader(type) as WebGLShader;

    // Send the source to the shader object

    gl.shaderSource(shader, source);

    // Compile the shader program

    gl.compileShader(shader);

    // See if it compiled successfully

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  useShaderProgram() {
    this.gl.useProgram(this.shaderProgram);
  }
}