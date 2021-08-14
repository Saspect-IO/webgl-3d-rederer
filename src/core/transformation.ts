import { Matrix4, Vector3 } from "./math";
import { degToRad } from "@/modules";

export default class Transformation {

    constructor() {

        this.position = new Vector3(0, 0, 0)
        this.scale = new Vector3(1, 1, 1) 
        this.rotation = new Vector3(0, 0, 0)
        this.modelMatrix = new Matrix4()
        this.normalMatrix = new Float32Array(9)

        //Direction Vectors, Need 4 elements for math operations with matrices
        this.forward = new Float32Array(4)      //When rotating, keep track of what the forward direction is
        this.up = new Float32Array(4)           //what the up direction is, invert to get bottom
        this.right = new Float32Array(4)        //what the right direction is, invert to get left
    }

    position: Vector3
    scale: Vector3
    rotation: Vector3
    modelMatrix: Matrix4
    normalMatrix: Float32Array
    forward: Float32Array
    up: Float32Array
    right: Float32Array


    updateMatrix() {
        this.modelMatrix.resetMat() //Order is very important!!
            .vtranslate(this.position)
            .rotateX(degToRad(this.rotation.x))
            .rotateY(degToRad(this.rotation.y))
            .rotateZ(degToRad(this.rotation.z))
            .vscale(this.scale);

        //Calcuate the Normal Matrix which doesn't need translate, then transpose and inverses the mat4 to mat3
        Matrix4.normalMat3(this.normalMatrix, this.modelMatrix.matrix);

        //Determine Direction after all the transformations.
        Matrix4.transformVec4(this.forward, [0, 0, 1, 0], this.modelMatrix.matrix) //Z
        Matrix4.transformVec4(this.up, [0, 1, 0, 0], this.modelMatrix.matrix)      //Y
        Matrix4.transformVec4(this.right, [1, 0, 0, 0], this.modelMatrix.matrix)   //X

        return this.modelMatrix.matrix;
    }

    updateDirection() {
        Matrix4.transformVec4(this.forward, [0, 0, 1, 0], this.modelMatrix.matrix)
        Matrix4.transformVec4(this.up, [0, 1, 0, 0], this.modelMatrix.matrix)
        Matrix4.transformVec4(this.right, [1, 0, 0, 0], this.modelMatrix.matrix)
        return this
    }

    getModelMatrix() {
        return this.modelMatrix.matrix
    }

    getNormalMatrix() {
        return this.normalMatrix
    }

    reset() {
        this.position.set(0, 0, 0)
        this.scale.set(1, 1, 1)
        this.rotation.set(0, 0, 0)
    }
}