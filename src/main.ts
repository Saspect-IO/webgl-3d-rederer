import Renderer from './core/renderer';
import ShaderProgram  from './core/shaderProgram';
import Camera  from './core/camera';
import Light  from './core/light';
import Mesh from './core/mesh';
import Controls from './core/controls';
import { CameraSettings, ProgramEntrySettings } from './modules';
import { degToRad } from './modules';
import Transformation from './core/transformation';
import Primitives from './core/primitives';


const model: Mesh[] = [];
const primitives: Primitives[] = [];
const canvas = document.getElementById(ProgramEntrySettings.WEBGL_CANVAS_ID) as HTMLCanvasElement;

const renderer = new Renderer(canvas);
const camera = new Camera(); 
const light = new Light(-1,-1,-1);
const controls = new Controls(canvas, camera);

const fieldOfViewRadians = degToRad(CameraSettings.FIELD_OF_VIEW);

renderer.setClearColor(255.0, 255.0, 255.0, 1.0);
const glContext = renderer.getContext() as WebGLRenderingContext;
const aspect = glContext.canvas.width / glContext.canvas.height

// Mesh.loadMesh(glContext, ProgramEntrySettings.PATH_ASSETS_SPHERE, ProgramEntrySettings.PATH_ASSETS_DIFFUSE)
//     .then((mesh) => model.push(mesh));

Primitives.loadPrimitives(glContext)
    .then((data) => primitives.push(data));

ShaderProgram.initShaderProgram(glContext, ProgramEntrySettings.PATH_SHADE_VERTEX, ProgramEntrySettings.PATH_SHADE_FRAGMENT)
    .then(shaderProgram => renderer.setShaderProgram(shaderProgram));


camera.position = (camera.position as Transformation).scale(0.05,0.05,0.05).rotateY(180);

camera.setOrthographic(
    CameraSettings.SCREEN_LEFT, 
    glContext.canvas.width,
    CameraSettings.SCREEN_TOP, 
    glContext.canvas.height, 
    CameraSettings.ORTHO_NEAR, 
    CameraSettings.ORTHO_FAR
);

// camera.setPerspective(fieldOfViewRadians, aspect, CameraSettings.NEAR_PLANE, CameraSettings.FAR_PLANE);

const loop = () => {
    renderer.render(camera, light, primitives);
    //controls.zoom(camera, fieldOfViewRadians, aspect, CameraSettings.NEAR_PLANE, CameraSettings.FAR_PLANE);
    requestAnimationFrame(loop);
}
loop();

