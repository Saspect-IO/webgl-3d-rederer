import { Vector3 } from "./math"
import ShaderProgram from './shaderProgram'

export default class Light {
    constructor(x: number = 20, y: number = 30, z: number = 50) {
        this.lightDirection = new Vector3(x, y, z)
        this.lightPosition = new Vector3(x, y, z)
        this.ambientLight = 0.3
    }

    lightDirection: Vector3
    ambientLight: number
    lightPosition: Vector3


    useLight(shaderProgram: ShaderProgram): void {
        const dir = this.lightDirection
        const point = this.lightPosition
        const gl = shaderProgram.gl
        // gl?.uniform3f(shaderProgram.lightDirection as WebGLUniformLocation, dir.x, dir.y, dir.z)
        // gl?.uniform1f(shaderProgram.ambientLight as WebGLUniformLocation, this.ambientLight)
        gl?.uniform3fv(shaderProgram.lightPosition, [point.x, point.y, point.z]);
    }

}