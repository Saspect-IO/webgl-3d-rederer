import { Vector3 } from "./math";
import ShaderProgram from './shaderProgram';

export default class Light {
    constructor(x: number = 1, y: number = 1, z: number = -1.5) {
        this.lightDirection = new Vector3(x, y, z);
        this.ambientLight = 0.3;
    }

    lightDirection: Vector3;
    ambientLight: number;


    useLight(shaderProgram: ShaderProgram): void {
        const dir = this.lightDirection;
        const gl = shaderProgram.gl;
        gl?.uniform3f(shaderProgram.lightDirection as WebGLUniformLocation, dir.x, dir.y, dir.z);
        gl?.uniform1f(shaderProgram.ambientLight as WebGLUniformLocation, this.ambientLight);
    }

}