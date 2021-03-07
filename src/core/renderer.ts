import {
    ProgramEntry
} from '../modules';
import ShaderProgram from './shaderProgram';
import Camera from './camera';
import Light from './light';
import Mesh from './mesh';

export default class Renderer {
    constructor(canvas: HTMLCanvasElement) {
        this.gl = canvas.getContext(ProgramEntry.WEBGL_CONTEXT);
        this.gl?.enable(this.gl.DEPTH_TEST);
        this.shaderProgram = null;
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

    render(camera: Camera, light: Light, objects: Array < Mesh > ) {
        this.gl?.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
        const shaderProgram = this.shaderProgram;

        if (!shaderProgram) {
            return;
        }

        shaderProgram.useShaderProgram();
        light.useLight(shaderProgram);
        camera.useCamera(shaderProgram);
        objects.forEach((mesh) => mesh.drawMesh(shaderProgram));
    }

}