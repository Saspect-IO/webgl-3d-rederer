export default class Texture {

    constructor(gl: WebGLRenderingContext, image: HTMLImageElement) {
        this.createdTexture = gl.createTexture() as WebGLTexture;
        // Set the newly created texture context as active texture
        gl.bindTexture(gl.TEXTURE_2D, this.createdTexture)
        // Set texture parameters, and pass the image that the texture is based on
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
        // Set filtering methods
        // Very often shaders will query the texture value between pixels,
        // and this is instructing how that value shall be calculated
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

        this.gl = gl;
    }

    createdTexture: WebGLTexture | null = null;
    gl: WebGLRenderingContext | null = null;
    TEXTURE_KEY = 'TEXTURE';

    useTexture(uniform: WebGLUniformLocation, binding: number): void {
        const gl = this.gl as WebGLRenderingContext;
        // We can bind multiple textures, and here we pick which of the bindings
        // we're setting right now
        gl.activeTexture(gl[`${this.TEXTURE_KEY}${binding}`])
        // After picking the binding, we set the texture
        gl.bindTexture(gl.TEXTURE_2D, this.createdTexture)
        // Finally, we pass to the uniform the binding ID we've used
        gl.uniform1i(uniform, binding)
        // The previous 3 lines are equivalent to:
        // texture[i] = this.createdTexture
        // uniform = i
    }

    static loadTexture(gl: WebGLRenderingContext, url: string): Promise < unknown > {
        return new Promise(function (resolve) {
            const image = new Image();
            image.onload = function () {
                resolve(new Texture(gl, image))
            };
            image.src = url
        });
    }
}