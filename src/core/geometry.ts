import Transformation from "./transformation";
import Vbuffer from "./vbuffer";
export default class Geometry {

    constructor(gl: WebGLRenderingContext, vertexCount: number, meshPositions: number[]) {
        this.vertexCount = vertexCount;
        this.positions = new Vbuffer(gl, meshPositions, this.vertexCount);
        this.transform = new Transformation();
        this.gl = gl;
    }

    gl: WebGLRenderingContext | null = null;
    vertexCount: number;
    positions: Vbuffer;
    transform: Transformation;
    drawMode: number = 0;

    //--------------------------------------------------------------------------
    //Getters/Setters
    setScale(x: number, y: number, z: number) {
        this.transform.scale.set(x, y, z);
        return this;
    }

    setPosition(x: number, y: number, z: number) {
        this.transform.position.set(x, y, z);
        return this;
    }

    setRotation(x: number, y: number, z: number) {
        this.transform.rotation.set(x, y, z);
        return this;
    }

    addScale(x: number, y: number, z: number) {
        this.transform.scale.x += x;
        this.transform.scale.y += y;
        this.transform.scale.y += y;
        return this;
    }

    addPosition(x: number, y: number, z: number) {
        this.transform.position.x += x;
        this.transform.position.y += y;
        this.transform.position.z += z;
        return this;
    }

    addRotation(x: number, y: number, z: number) {
        this.transform.rotation.x += x;
        this.transform.rotation.y += y;
        this.transform.rotation.z += z;
        return this;
    }

    destroy() {
        this.positions.destroy();
    }

    render() {
        this.gl?.drawArrays(this.drawMode , 0, this.vertexCount);
    }

    //--------------------------------------------------------------------------
    //Things to do before its time to render
    preRender() {
        this.transform.updateMatrix();
        return this;
    }
}