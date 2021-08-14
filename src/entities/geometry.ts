import Texture from "../core/Textures/texture";
import Vbuffer from "../core/vbuffer";

export interface UV {
    x: number;
    y: number;
}

export interface Normal {
    x: number;
    y: number;
    z: number;
}

export interface Vector {
    x: number;
    y: number;
    z: number;
}

export interface Vertex {
    uv: UV;
    normal: Normal;
    position: Vector;
}

export interface Surface {
    vertices: Array < Vertex > ;
}

export interface MeshData {
    positions?: Vbuffer; 
    normals?: Vbuffer; 
    uvs?: Vbuffer;
    indices?: Vbuffer;
    texture?: Texture;
    drawMode: number;
    vertexCount: number;
    noCulling?: boolean;
    doBlending?: boolean;    
}