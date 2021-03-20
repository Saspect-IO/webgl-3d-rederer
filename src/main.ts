import Renderer from './core/renderer';
import ShaderProgram  from './core/shaderProgram';
import Camera  from './core/camera';
import Light  from './core/light';
import Mesh from './core/mesh';
import Transformation  from './core/transformation';
import {
    ProgramEntrySettings,
    CameraSettings
} from './modules';


const canvas = document.getElementById(ProgramEntrySettings.WEBGL_CANVAS_ID) as HTMLCanvasElement;
const renderer = new Renderer(canvas);
renderer.setClearColor(0.0, 0.0, 0.0, 1.0);
const gl = renderer.getContext() as WebGLRenderingContext;

const meshArray: Mesh[] = [];

Mesh.loadMesh(gl, ProgramEntrySettings.PATH_ASSETS_SPHERE, ProgramEntrySettings.PATH_ASSETS_DIFFUSE)
    .then((mesh) => meshArray.push(mesh));

ShaderProgram.initShaderProgram(gl, ProgramEntrySettings.PATH_SHADE_VERTEX, ProgramEntrySettings.PATH_SHADE_FRAGMENT)
    .then(shaderProgram => renderer.setShaderProgram(shaderProgram));


const camera = new Camera(); 
camera.setOrthographic(16, 8, 12);
camera.position = (camera.position as Transformation).scale(0.18,0.18,0.18).translate(0,50,0);
const light = new Light(-1,-1,-1);

const loop = () => {
    renderer.render(camera, light, meshArray);
    camera.position = (camera.position as Transformation).rotateY(Math.PI / CameraSettings.CAMERA_ANGLE_DIVISION);
    requestAnimationFrame(loop);
}

loop();

