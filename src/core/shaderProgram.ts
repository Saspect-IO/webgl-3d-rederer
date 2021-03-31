export default class ShaderProgram {
  constructor(glContext: WebGLRenderingContext, vsSource: string, fsSource: string) {

    const vertexShader = this.loadShader(glContext, glContext.VERTEX_SHADER, vsSource) as WebGLShader;
    const fragmentShader = this.loadShader(glContext, glContext.FRAGMENT_SHADER, fsSource) as WebGLShader;
    const program = glContext.createProgram() as WebGLProgram;
    // this.createShaderProgram(glContext, program, fragmentShader, vertexShader);
    this.createPrimitiveShaderProgram(glContext, program, fragmentShader, vertexShader);
    this.glContext = glContext;

  }

  glContext: WebGLRenderingContext | null = null;
  positionIndex: number | null = null;
  normalIndex: number | null = null;
  uvIndex: number | null = null;
  model: WebGLUniformLocation | null = null;
  diffuse: WebGLUniformLocation | null = null;
  view: WebGLUniformLocation | null = null;
  projection: WebGLUniformLocation | null = null;
  ambientLight: WebGLUniformLocation | null = null;
  lightDirection: WebGLUniformLocation | null = null;
  vertexShader: WebGLShader | null = null;
  fragmentShader: WebGLShader | null = null;
  shaderProgram: WebGLProgram | null = null;

  // primitive
  positionLocation: number | null = null;
  colorLocation: number | null = null;
  matrixLocation: WebGLUniformLocation | null = null;
  fudgeLocation: WebGLUniformLocation | null = null;


  createShaderProgram(glContext: WebGLRenderingContext, program: WebGLProgram, vertexShader: WebGLShader, fragmentShader: WebGLShader):void{
      
      glContext.attachShader(program, vertexShader);
      glContext.attachShader(program, fragmentShader);
      glContext.linkProgram(program);
      if (!glContext.getProgramParameter(program, glContext.LINK_STATUS)) {
        console.error(glContext.getProgramInfoLog(program));
        glContext.deleteProgram(program);
        throw new Error('Failed to link shaderProgram');
      }
      
      this.positionIndex = glContext.getAttribLocation(program, 'position');
      this.normalIndex = glContext.getAttribLocation(program, 'normal');
      this.uvIndex = glContext.getAttribLocation(program, 'uv');
      this.model = glContext.getUniformLocation(program, 'model') as WebGLUniformLocation;
      this.view = glContext.getUniformLocation(program, 'view') as WebGLUniformLocation;
      this.projection = glContext.getUniformLocation(program, 'projection') as WebGLUniformLocation;
      this.ambientLight = glContext.getUniformLocation(program, 'ambientLight') as WebGLUniformLocation;
      this.lightDirection = glContext.getUniformLocation(program, 'lightDirection') as WebGLUniformLocation;
      this.diffuse = glContext.getUniformLocation(program, 'diffuse') as WebGLUniformLocation;
      this.vertexShader = vertexShader;
      this.fragmentShader = fragmentShader;
      this.shaderProgram = program;
  }


  createPrimitiveShaderProgram(glContext: WebGLRenderingContext, program: WebGLProgram, vertexShader: WebGLShader, fragmentShader: WebGLShader):void{
      
    glContext.attachShader(program, vertexShader);
    glContext.attachShader(program, fragmentShader);
    glContext.linkProgram(program);
    if (!glContext.getProgramParameter(program, glContext.LINK_STATUS)) {
      console.error(glContext.getProgramInfoLog(program));
      glContext.deleteProgram(program);
      throw new Error('Failed to link shaderProgram');
    }

    this.positionLocation = glContext.getAttribLocation(program, 'a_position');
    this.colorLocation = glContext.getAttribLocation(program, 'v_color');
    this.matrixLocation = glContext.getUniformLocation(program, 'u_matrix') as WebGLUniformLocation;
    this.fudgeLocation = glContext.getUniformLocation(program, 'u_fudgeFactor') as WebGLUniformLocation;
    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;
    this.shaderProgram = program;
}


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
    (this.glContext as WebGLRenderingContext).useProgram(this.shaderProgram);
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