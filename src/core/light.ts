import { Vector3 } from "./math";
import ShaderProgram from './shaderProgram';

export default class Light {
    constructor(x: number, y: number, z: number) {
        this.lightDirection = new Vector3(x, y, z);
        this.ambientLight = 0.3;
    }

    lightDirection: Vector3;
    ambientLight: number;


    useLight(shaderProgram: ShaderProgram): void {
        const dir = this.lightDirection;
        const gl = shaderProgram.gl;
        gl?.uniform3f(shaderProgram.lightDirection, dir.x, dir.y, dir.z);
        gl?.uniform1f(shaderProgram.ambientLight, this.ambientLight);
    }

}