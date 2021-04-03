import Renderer from './core/renderer';
import ShaderProgram  from './core/shaderProgram';
import {Camera, CameraController }  from './core/camera';
import Light  from './core/light';
import Mesh from './core/mesh';
import { ProgramEntrySettings } from './modules';
import { GridAxis } from './core/primitives';
import { GridAxisShader } from './core/shaderExtend';


const model: Mesh[] = [];

const canvas = document.getElementById(ProgramEntrySettings.WEBGL_CANVAS_ID) as HTMLCanvasElement;

const renderer = new Renderer(canvas);
renderer.fFitScreen(0.95,0.9).setClearColor(255, 255, 255, 1.0).fSetSize(800,600);
const gl = renderer.getContext() as WebGLRenderingContext;

const camera = new Camera(gl as WebGLRenderingContext); 
camera.transform.position.set(0,1,3);
const controls = new CameraController(gl as WebGLRenderingContext, camera);

//Setup Grid
const gGridShader = new GridAxisShader(gl as WebGLRenderingContext, camera.projection);

const gridMesh = GridAxis.loadGrid(gl, true);

// Mesh.loadMesh(gl, ProgramEntrySettings.PATH_ASSETS_SPHERE, ProgramEntrySettings.PATH_ASSETS_DIFFUSE)
//     .then((mesh) => model.push(mesh));


// ShaderProgram.initShaderProgram(gl, ProgramEntrySettings.PATH_SHADE_VERTEX, ProgramEntrySettings.PATH_SHADE_FRAGMENT)
//     .then(shaderProgram => renderer.setShaderProgram(shaderProgram));

const light = new Light(-1,-1,-1);

const loop = () => {
    renderer.render(camera, controls, model, gridMesh, gGridShader, light);
    requestAnimationFrame(loop);
}
loop();



