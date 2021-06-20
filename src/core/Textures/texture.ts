import { TEXTURE } from "@/modules";

export default class Texture {

    constructor(gl: WebGLRenderingContext, image: HTMLImageElement) {
        this.createdTexture = gl.createTexture() as WebGLTexture;
        gl.bindTexture(gl.TEXTURE_2D, this.createdTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.generateMipmap(gl.TEXTURE_2D);

        const depthTextureSize = 512;
        gl.texImage2D(
            gl.TEXTURE_2D,      // target
            0,                  // mip level
            gl.DEPTH_COMPONENT, // internal format
            depthTextureSize,   // width
            depthTextureSize,   // height
            0,                  // border
            gl.DEPTH_COMPONENT, // format
            gl.UNSIGNED_INT,    // type
            null
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            
        const depthFramebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer);
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,         // target
            gl.DEPTH_ATTACHMENT,    // attachment point
            gl.TEXTURE_2D,          // texture target
            this.createdTexture,    // texture
            0                       // mip level
        );
        
        // create a color texture of the same size as the depth texture
        const unusedTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, unusedTexture);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            depthTextureSize,
            depthTextureSize,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            null,
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        
        // attach it to the framebuffer
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,        // target
            gl.COLOR_ATTACHMENT0,  // attachment point
            gl.TEXTURE_2D,         // texture target
            unusedTexture,         // texture
            0                       // mip level
        );
        
        this.gl = gl;
    }

    createdTexture: WebGLTexture | null = null;
    gl: WebGLRenderingContext | null = null;
    TEXTURE_KEY = TEXTURE;

    useTexture(uniform: WebGLUniformLocation, binding: number): void {
        const gl = this.gl as WebGLRenderingContext;
        gl.activeTexture(gl[`${this.TEXTURE_KEY}${binding}`]);
        gl.bindTexture(gl.TEXTURE_2D, this.createdTexture);
        gl.uniform1i(uniform, binding);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    static loadTexture(gl: WebGLRenderingContext, url: string): Promise < Texture > {
        return new Promise(function (resolve) {
            const image = new Image();
            image.onload = function () {
                resolve(new Texture(gl, image))
            };
            image.src = url
        });
    }
}