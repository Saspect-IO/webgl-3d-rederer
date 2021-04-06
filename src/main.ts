import GLContext from './core/GLContext';
import {Camera, CameraController }  from './core/camera';
import { GridAxisShader, ModelShader } from './core/shaderExtend';
import { GridAxis } from './core/primitives';
import Renderer from './core/renderer';
import Light  from './core/light';
import Model from './core/model';
import { ProgramEntrySettings } from './modules';




const glContext = new GLContext(ProgramEntrySettings.WEBGL_CANVAS_ID);
glContext.fitScreen(0.95,0.90).setClearColor(255, 255, 255, 1.0).clear();
const gl = glContext.getContext() as WebGLRenderingContext;

const camera = new Camera(gl as WebGLRenderingContext); 
camera.transform.position.set(0,1,3);
const cemeraController = new CameraController(gl as WebGLRenderingContext, camera);

//Setup Grid
const gridShader = new GridAxisShader(gl as WebGLRenderingContext, camera.projection);
const gridMesh = GridAxis.loadGridMesh(gl, gridShader, true);

const modelShader = async () => await ModelShader.initModelShader(gl as WebGLRenderingContext, camera.projection, ProgramEntrySettings.PATH_SHADE_VERTEX, ProgramEntrySettings.PATH_SHADE_FRAGMENT)
const gridModel = async () => await Model.loadModel(gl, await modelShader(), ProgramEntrySettings.PATH_ASSETS_SPHERE, ProgramEntrySettings.PATH_ASSETS_DIFFUSE);

const renderer = new Renderer();
const light = new Light(-1,-1,-1);

const loop = async () => {
    renderer.render(glContext, camera, cemeraController, await gridModel(), gridMesh, gridShader, light);
    requestAnimationFrame(loop);
}
loop();



