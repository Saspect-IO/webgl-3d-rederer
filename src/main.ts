import GLContext from './core/GLContext';
import {Camera, CameraController }  from './core/camera';
import { GridAxisShader } from './core/shaderExtend';
import { GridAxis } from './core/primitives';
import Renderer from './core/renderer';
import Light  from './core/light';
import Model from './core/importeModel';
import { ProgramEntrySettings } from './modules';


const model: Model[] = [];

const glContext = new GLContext(ProgramEntrySettings.WEBGL_CANVAS_ID);
glContext.fitScreen(0.95,0.90).setClearColor(255, 255, 255, 1.0).clear();
const gl = glContext.getContext() as WebGLRenderingContext;

const camera = new Camera(gl as WebGLRenderingContext); 
camera.transform.position.set(0,1,3);
const cemeraController = new CameraController(gl as WebGLRenderingContext, camera);

//Setup Grid
const gridShader = new GridAxisShader(gl as WebGLRenderingContext, camera.projection);
const gridMesh = GridAxis.loadGridMesh(gl, gridShader, true);

const renderer = new Renderer();

// Mesh.loadMesh(gl, ProgramEntrySettings.PATH_ASSETS_SPHERE, ProgramEntrySettings.PATH_ASSETS_DIFFUSE)
//     .then((mesh) => model.push(mesh));


// ShaderProgram.initShaderProgram(gl, ProgramEntrySettings.PATH_SHADE_VERTEX, ProgramEntrySettings.PATH_SHADE_FRAGMENT)
//     .then(shaderProgram => renderer.setShaderProgram(shaderProgram));

const light = new Light(-1,-1,-1);

const loop = () => {
    renderer.render(glContext, camera, cemeraController, model, gridMesh, gridShader, light);
    requestAnimationFrame(loop);
}
loop();



