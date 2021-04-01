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