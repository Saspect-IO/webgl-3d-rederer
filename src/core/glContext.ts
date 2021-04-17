import { ProgramEntrySettings } from "@/modules";


export default class GLContext {
    constructor(WEBGL_CANVAS_ID: string) {
        const canvas = document.getElementById(WEBGL_CANVAS_ID) as HTMLCanvasElement;
        // cycle through and fallback to the first gl context that works 
        ([
            ProgramEntrySettings.WEBGL_CONTEXT,
            ProgramEntrySettings.WEBGL_CONTEXT_EXPERIMENTAL,
            ProgramEntrySettings.WEBGL_CONTEXT_WEBKIT,
            ProgramEntrySettings.WEBGL_CONTEXT_MOZ
        ]).some(option => this.gl = canvas.getContext(option) as WebGLRenderingContext);

        this.gl ?? alert(ProgramEntrySettings.WEBGL_CONTEXT_ERROR_MESSAGE);
        this.gl?.cullFace(this.gl.BACK);								//Back is also default
        this.gl?.frontFace(this.gl.CCW);								//Dont really need to set it, its ccw by default.
        this.gl?.enable(this.gl.DEPTH_TEST);							//Shouldn't use this, use something else to add depth detection
        this.gl?.enable(this.gl.CULL_FACE);							    //Cull back face, so only show triangles that are created clockwise
        this.gl?.depthFunc(this.gl.LEQUAL);							    //Near things obscure far things
        this.gl?.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);	//Setup default alpha blending

        this.canvas = canvas;
    }

    gl: WebGLRenderingContext | null = null;
    rgb_32_bit = 255;
    alpha = 1;
    canvas: HTMLCanvasElement;

    setSize(w: number, h: number) {
        //set the size of the canvas, on chrome we need to set it 3 ways to make it work perfectly.
        this.canvas.style.width = w + "px";
        this.canvas.style.height = h + "px";
        this.canvas.width = w;
        this.canvas.height = h;

        //when updating the canvas size, must reset the viewport of the canvas 
        //else the resolution webgl renders at will not change
        this.gl?.viewport(0, 0, w, h);
        
        return this;
    }

    //Set the size of the canvas to fill a % of the total screen.
    fitScreen(wp: number, hp: number) {
        return this.setSize(window.innerWidth * (wp || 1), window.innerHeight * (hp || 1));
    }

    setClearColor(red: number, green: number, blue: number, alpha: number = 1) {
        this.gl?.clearColor(red / this.rgb_32_bit, green / this.rgb_32_bit, blue / this.rgb_32_bit, alpha);
        return this
    }

    clear() {
        this.gl?.clear(this.gl?.COLOR_BUFFER_BIT | this.gl?.DEPTH_BUFFER_BIT);
        return this;
    }

    getContext() {
        return this.gl;
    }
}