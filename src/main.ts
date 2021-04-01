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

const cameraData = {
    fieldOfView: degToRad(CameraSettings.FIELD_OF_VIEW),
} 

renderer.setClearColor(0.0, 0.0, 0.0, 1.0);
const gl = renderer.getContext() as WebGLRenderingContext;
const aspect = (gl.canvas.width / gl.canvas.height);

// Primitives.loadPrimitives(gl)
//     .then((data) => primitives.push(data));

Mesh.loadMesh(gl, ProgramEntrySettings.PATH_ASSETS_SPHERE, ProgramEntrySettings.PATH_ASSETS_DIFFUSE)
    .then((mesh) => model.push(mesh));


ShaderProgram.initShaderProgram(gl, ProgramEntrySettings.PATH_SHADE_VERTEX, ProgramEntrySettings.PATH_SHADE_FRAGMENT)
    .then(shaderProgram => renderer.setShaderProgram(shaderProgram));

camera.setOrthographic(
    CameraSettings.SCREEN_LEFT, 
    gl.canvas.clientWidth,
    CameraSettings.SCREEN_TOP, 
    gl.canvas.clientHeight, 
    CameraSettings.ORTHO_NEAR, 
    CameraSettings.ORTHO_FAR
);

// camera.setPerspective(cameraData.fieldOfView, aspect, CameraSettings.NEAR_PLANE, CameraSettings.FAR_PLANE);

const loop = () => {
    renderer.render(camera, light, model);
    // controls.updateFieldOfView(cameraData.fieldOfView);
    camera.position = controls.zoom(camera);
    requestAnimationFrame(loop);
}
loop();

