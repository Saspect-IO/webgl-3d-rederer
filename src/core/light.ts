import { normalizeRGB } from "@/modules"
import { Vector3 } from "./math"
import { ModelShader } from "./model"

export default class Light {
    constructor(
        lightPosition: Vector3,
        lightColor = normalizeRGB({red:201, green:226, blue:255}),
        ambientLightColor = normalizeRGB({red:255, green:255, blue:255}),
        specularColor = normalizeRGB({red:255, green:255, blue:255}),
        specularFactor = 1,
        shininess = 500,
    ) { 
        this.lightPosition = lightPosition
        this.lightColor = lightColor
        this.ambientLightColor = ambientLightColor
        this.specularColor = specularColor
        this.specularFactor = specularFactor
        this.shininess = shininess
    }

    lightPosition: Vector3
    lightColor: Float32Array
    ambientLightColor: Float32Array
    specularColor: Float32Array
    specularFactor: number
    shininess: number
   

    setUniforms(gl:WebGLRenderingContext, program:ModelShader): void {
        gl.uniform3fv(program.lightPositionLoc, [this.lightPosition.x, this.lightPosition.y, this.lightPosition.z])
        gl.uniform4fv(program.lightColorLoc, this.lightColor)
        gl.uniform4fv(program.ambientLightColorLoc, this.ambientLightColor)
        gl.uniform4fv(program.specularColorLoc, this.specularColor)
        gl.uniform1f(program.specularFactorLoc, this.specularFactor)
        gl.uniform1f(program.shininessLoc, this.shininess)
    }

}