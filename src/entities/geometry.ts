import ImageTexture from "../core/Textures/imageTexture";
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
    positions: Vbuffer; 
    normals?: Vbuffer; 
    uvs?: Vbuffer;
    texture?: ImageTexture;
    drawMode: number;
    vertexCount: number;
    noCulling?: boolean;
    doBlending?: boolean;    
}