
import { MeshData } from "@/entities";
import DepthTexture from "./Textures/depthTexture";
import Texture from "./Textures/texture";
import Transformation from "./transformation";
export default class Geometry {

    constructor( mesh: MeshData) {

        this.mesh = mesh;
        this.transform = new Transformation();
    }

    mesh: MeshData;
    transform: Transformation;

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

    //--------------------------------------------------------------------------
    //Things to do before its time to render
    preRender() {
        this.transform.updateMatrix();
        return this;
    }
}