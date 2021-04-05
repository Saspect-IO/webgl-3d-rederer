import { Matrix4, Vector3 } from "./math";
import { degToRad } from "../modules";

export default class Transformation {

    constructor() {
        // identity matrix
        //transform vectors
        this.position = new Vector3(0, 0, 0); //Traditional X,Y,Z 3d position
        this.scale = new Vector3(1, 1, 1); //How much to scale a mesh. Having a 1 means no scaling is done.
        this.rotation = new Vector3(0, 0, 0); //Hold rotation values based on degrees, Object will translate it to radians
        this.matView = new Matrix4(); //Cache the results when calling updateMatrix
        this.matNormal = new Float32Array(9); //This is a Mat3, matrix array to hold the values is enough for what its used for

        //Direction Vectors, Need 4 elements for math operations with matrices
        this.forward = new Float32Array(4); //When rotating, keep track of what the forward direction is
        this.up = new Float32Array(4); //what the up direction is, invert to get bottom
        this.right = new Float32Array(4); //what the right direction is, invert to get left
    }

    position: Vector3;
    scale: Vector3;
    rotation: Vector3;
    matView: Matrix4;
    matNormal: Float32Array;
    forward: Float32Array;
    up: Float32Array;
    right: Float32Array;

    //--------------------------------------------------------------------------
    //Methods
    updateMatrix() {
        this.matView.resetMat() //Order is very important!!
            .vtranslate(this.position)
            .rotateX(degToRad(this.rotation.x))
            .rotateZ(degToRad(this.rotation.z))
            .rotateY(degToRad(this.rotation.y))
            .vscale(this.scale);

        //Calcuate the Normal Matrix which doesn't need translate, then transpose and inverses the mat4 to mat3
        Matrix4.normalMat3(this.matNormal, this.matView.matrix);

        //Determine Direction after all the transformations.
        Matrix4.transformVec4(this.forward, [0, 0, 1, 0], this.matView.matrix); //Z
        Matrix4.transformVec4(this.up, [0, 1, 0, 0], this.matView.matrix); //Y
        Matrix4.transformVec4(this.right, [1, 0, 0, 0], this.matView.matrix); //X

        return this.matView.matrix;
    }

    updateDirection() {
        Matrix4.transformVec4(this.forward, [0, 0, 1, 0], this.matView.matrix);
        Matrix4.transformVec4(this.up, [0, 1, 0, 0], this.matView.matrix);
        Matrix4.transformVec4(this.right, [1, 0, 0, 0], this.matView.matrix);
        return this;
    }

    getViewMatrix() {
        return this.matView.matrix;
    }

    getNormalMatrix() {
        return this.matNormal;
    }

    reset() {
        this.position.set(0, 0, 0);
        this.scale.set(1, 1, 1);
        this.rotation.set(0, 0, 0);
    }
}