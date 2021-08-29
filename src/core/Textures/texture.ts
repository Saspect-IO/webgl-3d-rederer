import { ModelShader } from "../model"

export default class Texture {

    constructor(gl: WebGLRenderingContext, image: HTMLImageElement) {
        const texture = gl.createTexture() as WebGLTexture
        gl.bindTexture(gl.TEXTURE_2D, texture as WebGLTexture)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.generateMipmap(gl.TEXTURE_2D)

        this.gl = gl
        this.texture  = texture
    }

    gl: WebGLRenderingContext;
    texture: WebGLTexture;

    // Asynchronously load an image
    static async loadTexture(gl: WebGLRenderingContext, url: string): Promise < Texture > {
        const image = new Image()
        image.src = url
        await image.decode()
        const result = new Texture(gl, image)
        return result
    }

    setUniform(program:ModelShader, index:number){
        this.gl.uniform1i(program[`sampler${index}Loc`], index)
        return this  
    }

    activate(index:number){
        this.gl.activeTexture(this.gl[`TEXTURE${index}`]);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture)
        return this 
    }

}