import { TEXTURE } from "@/modules";

export default class Texture {

    constructor(gl: WebGLRenderingContext, image: HTMLImageElement) {
        this.createdTexture = gl.createTexture() as WebGLTexture;
        gl.bindTexture(gl.TEXTURE_2D, this.createdTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.generateMipmap(gl.TEXTURE_2D);

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