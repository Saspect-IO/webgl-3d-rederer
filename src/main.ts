import Renderer from './core/renderer';
import ShaderProgram  from './core/shaderProgram';
import Camera  from './core/camera';
import Light  from './core/light';
import Mesh from './core/mesh';
import Controls from './core/controls';
import Transformation  from './core/transformation';
import { CameraSettings, ProgramEntrySettings } from './modules';


let currentAngle = [0.0, 0.0];
let translateX = 0;
let translateY = 50;
const model: Mesh[] = [];
const canvas = document.getElementById(ProgramEntrySettings.WEBGL_CANVAS_ID) as HTMLCanvasElement;


const renderer = new Renderer(canvas);
const camera = new Camera(); 
const light = new Light(-1,-1,-1);


renderer.setClearColor(0.0, 0.0, 0.0, 1.0);
const glContext = renderer.getContext() as WebGLRenderingContext;


Mesh.loadMesh(glContext, ProgramEntrySettings.PATH_ASSETS_SPHERE, ProgramEntrySettings.PATH_ASSETS_DIFFUSE)
    .then((mesh) => model.push(mesh));

ShaderProgram.initShaderProgram(glContext, ProgramEntrySettings.PATH_SHADE_VERTEX, ProgramEntrySettings.PATH_SHADE_FRAGMENT)
    .then(shaderProgram => renderer.setShaderProgram(shaderProgram));

Controls.initMouseControl(canvas, camera, currentAngle, translateX, translateY);


camera.setOrthographic(16, 8, 12);
camera.position = (camera.position as Transformation).scale(0.18,0.18,0.18).translate(translateX,translateY,0);


const loop = () => {
    renderer.render(camera, light, model);
    requestAnimationFrame(loop);
}
loop();

