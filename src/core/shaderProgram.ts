export default class ShaderProgram {
  constructor(glContext: WebGLRenderingContext, vsSource: string, fsSource: string) {

    const vertexShader = this.loadShader(glContext, glContext.VERTEX_SHADER, vsSource) as WebGLShader;
    const fragmentShader = this.loadShader(glContext, glContext.FRAGMENT_SHADER, fsSource) as WebGLShader;

    // Create the shader program
    const shaderProgram = glContext.createProgram() as WebGLProgram;
    glContext.attachShader(shaderProgram, vertexShader);
    glContext.attachShader(shaderProgram, fragmentShader);
    glContext.linkProgram(shaderProgram);
    if (!glContext.getProgramParameter(shaderProgram, glContext.LINK_STATUS)) {
      console.error(glContext.getProgramInfoLog(shaderProgram));
      glContext.deleteProgram(shaderProgram);
      throw new Error('Failed to link shaderProgram');
    }

    this.glContext = glContext;
    this.positionIndex = glContext.getAttribLocation(shaderProgram, 'position');
    this.normalIndex = glContext.getAttribLocation(shaderProgram, 'normal');
    this.uvIndex = glContext.getAttribLocation(shaderProgram, 'uv');
    this.model = glContext.getUniformLocation(shaderProgram, 'model') as WebGLUniformLocation;
    this.view = glContext.getUniformLocation(shaderProgram, 'view') as WebGLUniformLocation;
    this.projection = glContext.getUniformLocation(shaderProgram, 'projection') as WebGLUniformLocation;
    this.ambientLight = glContext.getUniformLocation(shaderProgram, 'ambientLight') as WebGLUniformLocation;
    this.lightDirection = glContext.getUniformLocation(shaderProgram, 'lightDirection') as WebGLUniformLocation;
    this.diffuse = glContext.getUniformLocation(shaderProgram, 'diffuse') as WebGLUniformLocation;
    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;
    this.shaderProgram = shaderProgram;

  }

  glContext: WebGLRenderingContext;
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


  loadShader(glContext: WebGLRenderingContext, type: number, source: string) {
    const shader = glContext.createShader(type) as WebGLShader;

    // Send the source to the shader object
    glContext.shaderSource(shader, source);

    // Compile the shader program
    glContext.compileShader(shader);

    // See if it compiled successfully
    if (!glContext.getShaderParameter(shader, glContext.COMPILE_STATUS)) {
      alert('An error occurred compiling the shaders: ' + glContext.getShaderInfoLog(shader));
      glContext.deleteShader(shader);
      return null;
    }

    return shader;
  }

  useShaderProgram() {
    this.glContext.useProgram(this.shaderProgram);
  }

  // Loads shader files from the given URLs, and returns a program as a promise
  static async initShaderProgram(glContext: WebGLRenderingContext, vsSource: string, fsSource: string) {

    const loadFile = async (src: string) => {
      const response = await fetch(src);
      const data = await response.text();
      return data;
    }
    
    const [vertexShaderFile, fragmentShaderFile] = await Promise.all([loadFile(vsSource), loadFile(fsSource)]);
    const shaderProgram = new ShaderProgram(glContext, vertexShaderFile, fragmentShaderFile);

    return shaderProgram;
  }
}