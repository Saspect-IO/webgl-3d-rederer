export default class ImageTexture {

    constructor(gl: WebGLRenderingContext, image: HTMLImageElement) {
        const createdTexture = gl.createTexture() as WebGLTexture
        gl.bindTexture(gl.TEXTURE_2D, createdTexture)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.generateMipmap(gl.TEXTURE_2D)
    }

    // Asynchronously load an image
    static loadTexture(gl: WebGLRenderingContext, url: string): Promise < ImageTexture > {
        return new Promise(function (resolve) {
            const image = new Image()
            image.onload = function () {
                resolve(new ImageTexture(gl, image))
            };
            image.src = url
        });
    }
}