import { Camera } from "./camera"
import { Vector3 } from "./math"
import ShaderProgram from './shaderProgram'

export default class Light {
    constructor(x: number = 0, y: number = 3, z: number = 10) {
        this.lightDirection = new Vector3(x, y, z)
        this.lightPosition = new Vector3(x, y, z)
        this.ambientLight = 0.3
    }

    lightDirection: Vector3
    ambientLight: number
    lightPosition: Vector3


    useLight(shaderProgram: ShaderProgram, camera:Camera): void {
        const gl = shaderProgram.gl

        // directional light
        const dir = this.lightDirection
        // gl?.uniform3f(shaderProgram.lightDirection as WebGLUniformLocation, dir.x, dir.y, dir.z)
        // gl?.uniform1f(shaderProgram.ambientLight as WebGLUniformLocation, this.ambientLight)

        // point light
        const point = this.lightPosition
        const shininess = 1000
        gl?.uniform3fv(shaderProgram.lightPosition, [point.x, point.y, point.z]);
        gl?.uniform3fv(shaderProgram.cameraPosition, camera.transform.position.getFloatArray());
        gl?.uniform1f(shaderProgram.shininess, shininess);
    }

}