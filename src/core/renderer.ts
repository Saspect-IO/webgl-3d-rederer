
import GLContext from './GLContext';
import {Camera, CameraController } from '../core/camera';
import Light from './light';
import Mesh from './mesh';
import {GridAxisShader} from './shaderExtend';
import { GridAxis } from './primitives';


export default class Renderer {
    constructor() {}


    render(glContext: GLContext, camera: Camera, cemeraController: CameraController, model: Mesh[], grid: GridAxis, gridShader: GridAxisShader, light: Light, ) {
        
        camera.updateViewMatrix();
        glContext.clear();

        // const shaderProgram = this.shaderProgram;
        
        // if (!shaderProgram) {
        //     return;
        // }
        
        gridShader.activate()
            .setCameraMatrix(camera.viewMatrix)
            .renderMesh(grid.preRender())
            .setGridMatrix();
        //shaderProgram.activate()
        // light.useLight(shaderProgram);
        //model.forEach((mesh) => mesh.drawMesh(shaderProgram));
    }

}