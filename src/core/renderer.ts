import {
    ProgramEntrySettings
} from '../modules';
import ShaderProgram from './shaderProgram';
import Camera from './camera';
import Light from './light';
import Mesh from './mesh';
import Primitives from './primitives';

export default class Renderer {
    constructor(canvas: HTMLCanvasElement) {
        ([
            ProgramEntrySettings.WEBGL_CONTEXT,
            ProgramEntrySettings.WEBGL_CONTEXT_EXPERIMENTAL,
            ProgramEntrySettings.WEBGL_CONTEXT_WEBKIT,
            ProgramEntrySettings.WEBGL_CONTEXT_MOZ
        ]).some(option => this.glContext = canvas.getContext(option) as WebGLRenderingContext);

        this.glContext ?? alert(ProgramEntrySettings.WEBGL_CONTEXT_ERROR_MESSAGE);
        this.glContext?.enable(this.glContext.CULL_FACE);
        this.glContext?.enable(this.glContext.DEPTH_TEST);
    }

    glContext: WebGLRenderingContext | null = null;
    shaderProgram: ShaderProgram | null = null;
    rgb_32_bit = 255;
    alpha = 1;

    setClearColor(red: number, green: number, blue: number, alpha: number = 1) {
        this.glContext?.clearColor(red / this.rgb_32_bit, green / this.rgb_32_bit, blue / this.rgb_32_bit, alpha);
    }

    getContext() {
        return this.glContext;
    }

    setShaderProgram(shaderProgram: ShaderProgram) {
        this.shaderProgram = shaderProgram;
    }

    render(camera: Camera, light: Light, model: Mesh[], matrix: number[] ) {
        this.glContext?.clear(this.glContext.COLOR_BUFFER_BIT | this.glContext.DEPTH_BUFFER_BIT)
        const shaderProgram = this.shaderProgram;

        if (!shaderProgram) {
            return;
        }

        shaderProgram.useShaderProgram();
        light.useLight(shaderProgram);
        camera.useCamera(shaderProgram);
        model.forEach((mesh) => mesh.drawMesh(shaderProgram, matrix));
    }

}