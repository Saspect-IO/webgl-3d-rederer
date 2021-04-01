import Renderer from './core/renderer';
import ShaderProgram  from './core/shaderProgram';
import {Camera, CameraController}  from './core/camera';
import Light  from './core/light';
import Mesh from './core/mesh';
import { ProgramEntrySettings } from './modules';
import { GridAxisShader } from './core/shaderExtend';
import GLContext from './core/glContext';
import { GridAxis } from './core/primitives';

const model: Mesh[] = [];

const glContext = new GLContext(ProgramEntrySettings.WEBGL_CANVAS_ID).fFitScreen(0.95,0.9).fClear();

const camera = new Camera(glContext.gl as WebGLRenderingContext); 
camera.transform.position.set(0,1,3);
const controls = new CameraController(glContext.gl as WebGLRenderingContext, camera);

//Setup Grid
const gGridShader = new GridAxisShader(glContext.gl as WebGLRenderingContext, camera.projection);
const gGridModal = GridAxis.createModal(glContext, true);

const renderer = new Renderer(glContext.gl as WebGLRenderingContext);

const light = new Light(-1,-1,-1);

// Mesh.loadMesh(glContext.gl as WebGLRenderingContext, ProgramEntrySettings.PATH_ASSETS_SPHERE, ProgramEntrySettings.PATH_ASSETS_DIFFUSE)
//     .then((mesh) => model.push(mesh));


// ShaderProgram.initShaderProgram(glContext.gl as WebGLRenderingContext, ProgramEntrySettings.PATH_SHADE_VERTEX, ProgramEntrySettings.PATH_SHADE_FRAGMENT)
//     .then(shaderProgram => renderer.setShaderProgram(shaderProgram));


const loop = () => {
    renderer.render(glContext, camera, controls, gGridShader, gGridModal,  light, model);

    requestAnimationFrame(loop);
}
loop();

