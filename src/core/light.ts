import { normalizeColor } from "@/modules"
import { Camera } from "./camera"
import { Vector3 } from "./math"
import { ModelShader } from "./model"

export default class Light {
    constructor(x: number = 0, y: number = 3, z: number = 10) {
        this.lightPosition = new Vector3(x, y, z)
        this.specularFactor = 1
        this.lightColor = normalizeColor({red:195, green:210, blue:190})
        this.ambientLightColor = normalizeColor({red:25.5, green:25.5, blue:25.5})
        this.specularColor = normalizeColor({red:195, green:210, blue:190})
        this.shininess = 500
        this.specularFactor = 1
    }

    lightPosition: Vector3
    lightColor: Float32Array
    ambientLightColor: Float32Array
    specularColor: Float32Array
    shininess: number
    specularFactor: number

    setUniforms(gl:WebGLRenderingContext, program:ModelShader, camera:Camera): void {
        gl.uniform3fv(program.lightPositionLoc, [this.lightPosition.x, this.lightPosition.y, this.lightPosition.z]);
        gl.uniform4fv(program.lightColorLoc, this.lightColor);
        gl.uniform4fv(program.ambientLightColorLoc, this.ambientLightColor)
        gl.uniform4fv(program.specularColorLoc, this.specularColor);
        gl.uniform3fv(program.cameraPositionLoc, camera.transform.position.getFloatArray());
        gl.uniform1f(program.shininessLoc, this.shininess);
        gl.uniform1f(program.specularFactorLoc, this.specularFactor);
    }

}