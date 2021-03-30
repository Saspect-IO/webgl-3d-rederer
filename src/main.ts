import Renderer from './core/renderer';
import ShaderProgram  from './core/shaderProgram';
import Camera  from './core/camera';
import Light  from './core/light';
import Mesh from './core/mesh';
import Controls from './core/controls';
import { CameraSettings, ProgramEntrySettings } from './modules';


const model: Mesh[] = [];
const canvas = document.getElementById(ProgramEntrySettings.WEBGL_CANVAS_ID) as HTMLCanvasElement;

const renderer = new Renderer(canvas);
const camera = new Camera(); 
const light = new Light(-1,-1,-1);
const controls = new Controls(canvas, camera);

renderer.setClearColor(0.0, 0.0, 0.0, 1.0);
const glContext = renderer.getContext() as WebGLRenderingContext;
const aspect = glContext.canvas.width / glContext.canvas.height

Mesh.loadMesh(glContext, ProgramEntrySettings.PATH_ASSETS_SPHERE, ProgramEntrySettings.PATH_ASSETS_DIFFUSE)
    .then((mesh) => model.push(mesh));

ShaderProgram.initShaderProgram(glContext, ProgramEntrySettings.PATH_SHADE_VERTEX, ProgramEntrySettings.PATH_SHADE_FRAGMENT)
    .then(shaderProgram => renderer.setShaderProgram(shaderProgram));

camera.setPerspective(aspect, CameraSettings.FIELD_OF_VIEW, CameraSettings.NEAR_PLANE, CameraSettings.FAR_PLANE);

const loop = () => {
    renderer.render(camera, light, model);
    camera.position = controls.zoom(camera);
    requestAnimationFrame(loop);
}
loop();

