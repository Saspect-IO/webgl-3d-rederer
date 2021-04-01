export default class ShaderProgram {
  constructor(gl: WebGLRenderingContext, vsSource: string, fsSource: string) {

    const vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vsSource) as WebGLShader;
    const fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fsSource) as WebGLShader;
    const program = gl.createProgram() as WebGLProgram;
    this.createShaderProgram(gl, program, fragmentShader, vertexShader);
    //this.createPrimitiveShaderProgram(gl, program, fragmentShader, vertexShader);
    this.gl = gl;

  }

  gl: WebGLRenderingContext | null = null;
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


  createShaderProgram(gl: WebGLRenderingContext, program: WebGLProgram, vertexShader: WebGLShader, fragmentShader: WebGLShader):void{
      
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        throw new Error('Failed to link shaderProgram');
      }
      
      this.positionIndex = gl.getAttribLocation(program, 'position');
      this.normalIndex = gl.getAttribLocation(program, 'normal');
      this.uvIndex = gl.getAttribLocation(program, 'uv');
      this.model = gl.getUniformLocation(program, 'model') as WebGLUniformLocation;
      this.view = gl.getUniformLocation(program, 'view') as WebGLUniformLocation;
      this.projection = gl.getUniformLocation(program, 'projection') as WebGLUniformLocation;
      this.ambientLight = gl.getUniformLocation(program, 'ambientLight') as WebGLUniformLocation;
      this.lightDirection = gl.getUniformLocation(program, 'lightDirection') as WebGLUniformLocation;
      this.diffuse = gl.getUniformLocation(program, 'diffuse') as WebGLUniformLocation;
      this.vertexShader = vertexShader;
      this.fragmentShader = fragmentShader;
      this.shaderProgram = program;
  }


  createPrimitiveShaderProgram(gl: WebGLRenderingContext, program: WebGLProgram, vertexShader: WebGLShader, fragmentShader: WebGLShader):void{
      
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      throw new Error('Failed to link shaderProgram');
    }

    this.positionLocation = gl.getAttribLocation(program, 'a_position');
    this.colorLocation = gl.getAttribLocation(program, 'v_color');
    this.matrixLocation = gl.getUniformLocation(program, 'u_matrix') as WebGLUniformLocation;
    this.fudgeLocation = gl.getUniformLocation(program, 'u_fudgeFactor') as WebGLUniformLocation;
    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;
    this.shaderProgram = program;
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
    (this.gl as WebGLRenderingContext).useProgram(this.shaderProgram);
  }

  // Loads shader files from the given URLs, and returns a program as a promise
  static async initShaderProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string) {

    const loadFile = async (src: string) => {
      const response = await fetch(src);
      const data = await response.text();
      return data;
    }
    
    const [vertexShaderFile, fragmentShaderFile] = await Promise.all([loadFile(vsSource), loadFile(fsSource)]);
    const shaderProgram = new ShaderProgram(gl, vertexShaderFile, fragmentShaderFile);

    return shaderProgram;
  }
}