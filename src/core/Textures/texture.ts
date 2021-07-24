export default class Texture {

    constructor(gl: WebGLRenderingContext, image: HTMLImageElement) {
        const texture = gl.createTexture() as WebGLTexture
        gl.bindTexture(gl.TEXTURE_2D, texture as WebGLTexture)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.generateMipmap(gl.TEXTURE_2D)

        this.gl = gl
    }

    gl: WebGLRenderingContext;

    // Asynchronously load an image
    static loadTexture(gl: WebGLRenderingContext, url: string): Promise < Texture > {
        return new Promise(function (resolve) {
            const image = new Image()
            image.onload = function () {
                resolve(new Texture(gl, image))
            };
            image.src = url
        });
    }

}