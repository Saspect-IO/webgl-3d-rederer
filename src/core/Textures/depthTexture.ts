import { TEXTURE } from "@/modules";

export default class DepthTexture {

    constructor(gl: WebGLRenderingContext, depthTextureSize: number) {
        this.depthTexture = gl.createTexture() as WebGLTexture;
        gl.bindTexture(gl.TEXTURE_2D, this.depthTexture)
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
            
        this.depthFramebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.depthFramebuffer);
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER,         // target
            gl.DEPTH_ATTACHMENT,    // attachment point
            gl.TEXTURE_2D,          // texture target
            this.depthTexture,    // texture
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
        this.depthTextureSize = depthTextureSize
        this.gl = gl
    }

    depthTexture: WebGLTexture | null = null;
    depthFramebuffer: WebGLFramebuffer | null = null;
    depthTextureSize:number;
    gl: WebGLRenderingContext;
    TEXTURE_KEY = TEXTURE;



    useDepthTexture(uniform: WebGLUniformLocation, depthFramebuffer: WebGLFramebuffer, depthTexture:WebGLTexture, binding: number): void {
        const gl = this.gl as WebGLRenderingContext;
        gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer);
        gl.activeTexture((gl as {[key:string]: any})[`${this.TEXTURE_KEY}${binding}`]);
        gl.bindTexture(gl.TEXTURE_2D, depthTexture);
        //gl.uniform1i(uniform, binding);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

}