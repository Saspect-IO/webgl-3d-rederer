import {
    ProgramEntrySettings
} from '../modules';
import ShaderProgram from './shaderProgram';
import {Camera, CameraController }  from '../core/camera';
import Light from './light';
import Mesh from './mesh';
import { GridAxisShader } from './shaderExtend';
import Modal from './modal';

export default class Renderer {
    constructor(canvas: HTMLCanvasElement) {
        ([
            ProgramEntrySettings.WEBGL_CONTEXT,
            ProgramEntrySettings.WEBGL_CONTEXT_EXPERIMENTAL,
            ProgramEntrySettings.WEBGL_CONTEXT_WEBKIT,
            ProgramEntrySettings.WEBGL_CONTEXT_MOZ
        ]).some(option => this.gl = canvas.getContext(option) as WebGLRenderingContext);

        this.gl ?? alert(ProgramEntrySettings.WEBGL_CONTEXT_ERROR_MESSAGE);
        this.gl?.enable(this.gl.CULL_FACE);
        this.gl?.enable(this.gl.DEPTH_TEST);
    }

    gl: WebGLRenderingContext | null = null;
    shaderProgram: ShaderProgram | null = null;
    rgb_32_bit = 255;
    alpha = 1;

    setClearColor(red: number, green: number, blue: number, alpha: number = 1) {
        this.gl?.clearColor(red / this.rgb_32_bit, green / this.rgb_32_bit, blue / this.rgb_32_bit, alpha);
    }

    getContext() {
        return this.gl;
    }

    setShaderProgram(shaderProgram: ShaderProgram) {
        this.shaderProgram = shaderProgram;
    }

    render(camera: Camera, controler:CameraController,  model: Mesh[], gridModal:Modal, gGridShader:GridAxisShader, light: Light,) {
        camera.updateViewMatrix();
        this.gl?.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
        const shaderProgram = this.shaderProgram;

        if (!shaderProgram) {
            return;
        }

        gGridShader.activate().setCameraMatrix(camera.viewMatrix).renderModal(gridModal.preRender());
        // light.useLight(shaderProgram);
        // model.forEach((mesh) => mesh.drawMesh(shaderProgram));
    }

}