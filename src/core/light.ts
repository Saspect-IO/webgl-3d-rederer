import { normalizeColor } from "@/modules"
import { Camera } from "./camera"
import { Vector3 } from "./math"
import ShaderProgram from './shaderProgram'

export default class Light {
    constructor(x: number = 0, y: number = 3, z: number = 10) {
        this.lightDirection = new Vector3(x, y, z)
        this.lightPosition = new Vector3(x, y, z)
        this.specularFactor = 1
        this.lightColor = normalizeColor({red:195, green:210, blue:190})
        this.ambientLightColor = normalizeColor({red:25.5, green:25.5, blue:25.5})
        this.specularColor = normalizeColor({red:195, green:210, blue:190})
        this.shininess = 500
        this.specularFactor = 1
    }

    lightDirection: Vector3
    lightPosition: Vector3
   
    lightColor: Float32Array
    ambientLightColor: Float32Array
    specularColor: Float32Array
    shininess: number
    specularFactor: number

    useLight(shaderProgram: ShaderProgram, camera:Camera): void {
        const gl = shaderProgram.gl

        // directional light
        const dir = this.lightDirection
        // gl?.uniform3f(shaderProgram.lightDirection as WebGLUniformLocation, dir.x, dir.y, dir.z)
        gl?.uniform4fv(shaderProgram.ambientLightColor, this.ambientLightColor)
        gl?.uniform3fv(shaderProgram.lightPosition, [this.lightPosition.x, this.lightPosition.y, this.lightPosition.z]);
        gl?.uniform3fv(shaderProgram.cameraPosition, camera.transform.position.getFloatArray());
        gl?.uniform1f(shaderProgram.shininessLocation, this.shininess);
        gl?.uniform4fv(shaderProgram.lightColorLocation, this.lightColor);
        gl?.uniform4fv(shaderProgram.specularColorLocation, this.specularColor);
        gl?.uniform1f(shaderProgram.specularFactorLocation, this.specularFactor);
    }

}