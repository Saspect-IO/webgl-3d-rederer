export default class Texture {

    constructor(glContext: WebGLRenderingContext, image: HTMLImageElement) {
        this.createdTexture = glContext.createTexture() as WebGLTexture;
        // Set the newly created texture context as active texture
        glContext.bindTexture(glContext.TEXTURE_2D, this.createdTexture)
        // Set texture parameters, and pass the image that the texture is based on
        glContext.texImage2D(glContext.TEXTURE_2D, 0, glContext.RGBA, glContext.RGBA, glContext.UNSIGNED_BYTE, image)
        // Set filtering methods
        // Very often shaders will query the texture value between pixels,
        // and this is instructing how that value shall be calculated
        glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MAG_FILTER, glContext.LINEAR)
        glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MIN_FILTER, glContext.LINEAR)

        this.glContext = glContext;
    }

    createdTexture: WebGLTexture | null = null;
    glContext: WebGLRenderingContext | null = null;
    TEXTURE_KEY = 'TEXTURE';

    useTexture(uniform: WebGLUniformLocation, binding: number): void {
        const glContext = this.glContext as WebGLRenderingContext;
        // We can bind multiple textures, and here we pick which of the bindings
        // we're setting right now
        glContext.activeTexture(glContext[`${this.TEXTURE_KEY}${binding}`])
        // After picking the binding, we set the texture
        glContext.bindTexture(glContext.TEXTURE_2D, this.createdTexture)
        // Finally, we pass to the uniform the binding ID we've used
        glContext.uniform1i(uniform, binding)
        // The previous 3 lines are equivalent to:
        // texture[i] = this.createdTexture
        // uniform = i
    }

    static loadTexture(glContext: WebGLRenderingContext, url: string): Promise < unknown > {
        return new Promise(function (resolve) {
            const image = new Image();
            image.onload = function () {
                resolve(new Texture(glContext, image))
            };
            image.src = url
        });
    }
}