
import GLContext from './GLContext';
import {Camera, CameraController } from '../core/camera';
import Light from './light';
import Model from './model';
import {GridAxisShader} from './shaderExtend';
import { GridAxis } from './primitives';


export default class Renderer {
    constructor() {}


    render(glContext: GLContext, camera: Camera, cemeraController: CameraController, model: Model, grid: GridAxis, gridShader: GridAxisShader, light: Light, ) {
        
        camera.updateViewMatrix();
        glContext.clear();
        gridShader.activate()
            .setCameraMatrix(camera.viewMatrix)
            .renderMesh(grid.preRender())
            .setGridMatrix();
    }

}