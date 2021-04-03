import {
    ProgramEntrySettings
} from '../modules';
import ShaderProgram from './shaderProgram';
import {
    Camera,
    CameraController
} from '../core/camera';
import Light from './light';
import Mesh from './mesh';
import {
    GridAxisShader
} from './shaderExtend';
import Modal from './modal';
import { GridAxis } from './primitives';

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

        this.canvas = canvas;
    }

    gl: WebGLRenderingContext | null = null;
    shaderProgram: ShaderProgram | null = null;
    rgb_32_bit = 255;
    alpha = 1;
    canvas:HTMLCanvasElement;

    fSetSize(w:number, h:number) {
        //set the size of the canvas, on chrome we need to set it 3 ways to make it work perfectly.
        this.canvas.style.width = w + "px";
        this.canvas.style.height = h + "px";
        this.canvas.width = w;
        this.canvas.height = h;

        //when updating the canvas size, must reset the viewport of the canvas 
        //else the resolution webgl renders at will not change
        // this.viewport(0, 0, w, h);
        return this;
    }

    //Set the size of the canvas to fill a % of the total screen.
    fFitScreen(wp:number, hp:number) {
        return this.fSetSize(window.innerWidth * (wp || 1), window.innerHeight * (hp || 1));
    }

    setClearColor(red: number, green: number, blue: number, alpha: number = 1) {
        this.gl?.clearColor(red / this.rgb_32_bit, green / this.rgb_32_bit, blue / this.rgb_32_bit, alpha);
        return this
    }

    getContext() {
        return this.gl;
    }

    setShaderProgram(shaderProgram: ShaderProgram) {
        this.shaderProgram = shaderProgram;
    }

    render(camera: Camera, controler: CameraController, model: Mesh[], grid: GridAxis, gGridShader: GridAxisShader, light: Light, ) {
        camera.updateViewMatrix();
        this.gl?.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
        // const shaderProgram = this.shaderProgram;

        // console.log(gridModal.mesh);
        
        // if (!shaderProgram) {
        //     return;
        // }
        
        gGridShader.activate()
            .setGridMatrix()
            .setCameraMatrix(camera.viewMatrix)
            .renderGrid(grid.preRender());
        //shaderProgram.activate()
        // light.useLight(shaderProgram);
        //model.forEach((mesh) => mesh.drawMesh(shaderProgram));
    }

}