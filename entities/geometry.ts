export interface UV {
    x: number;
    y: number;
}

export interface Normal {
    x: number;
    y: number;
    z: number;
}

export interface Position {
    x: number;
    y: number;
    z: number;
}

export interface Vertex {
    uv: UV;
    normal: Normal;
    position: Position;
}

export interface Surface {
    vertices: Array < Vertex > ;
}