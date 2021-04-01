import ShaderProgram from './shaderProgram';
import {Camera, CameraController} from './camera';
import Light from './light';
import Mesh from './mesh';
import { GridAxisShader } from './shaderExtend';
import Modal from './modal';
import GLContext from './glContext';

export default class Renderer {

    constructor(gl: WebGLRenderingContext) {
        gl?.enable(gl.CULL_FACE);
        gl?.enable(gl.DEPTH_TEST);
    }

    shaderProgram: ShaderProgram | null = null;
    rgb_32_bit = 255;
    alpha = 1;

    setShaderProgram(shaderProgram: ShaderProgram) {
        this.shaderProgram = shaderProgram;
    }

    render(glContext:GLContext, camera: Camera, controls:CameraController, gGridShader:GridAxisShader, gGridModal:Modal, light: Light, model: Mesh[]) {
        
        camera.updateViewMatrix();
        glContext.fClear();

        gGridShader.activate()
            .setCameraMatrix(camera.viewMatrix)
            .renderModal(gGridModal.preRender());
    }

}