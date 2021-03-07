import {Vec3Struct} from "./geometry";

export default class Light {
    constructor() {
        this.lightDirection = new Vec3Struct(-1, -1, -1);
        this.ambientLight = 0.3;
    }

    lightDirection: any;
    ambientLight: number;


    useLight(shaderProgram): void {
        const dir = this.lightDirection;
        const gl = shaderProgram.gl;
        gl.uniform3f(shaderProgram.lightDirection, dir.x, dir.y, dir.z);
        gl.uniform1f(shaderProgram.ambientLight, this.ambientLight);
    }

}