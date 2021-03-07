import { Normal, Position, Surface, UV, Vertex } from "../entities";

export default class Geometry {

    constructor(surfaces: Array < Surface >) {
        this.surfaces = [...surfaces];
    }

    surfaces: Array < Surface > = [];
    vertices: Array < Vertex > = [];
    position: Position = null;
    normal: Normal = null;
    uv: UV = null;
    x: number = 0;
    y: number = 0;
    z: number = 0;

    static parseOBJ(src:string) {

        const POSITION = /^v\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)/
        const NORMAL = /^vn\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)/
        const UV = /^vt\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)/
        const FACE = /^f\s+(-?\d+)\/(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)\/(-?\d+)(?:\s+(-?\d+)\/(-?\d+)\/(-?\d+))?/

        let lines = src.split('\n');
        const positions = [];
        const uvs = [];
        const normals = [];
        const surfaces = [];

        lines.forEach(function (line: string) {
            // Match each line of the file against various RegEx-es
            let result = null;
            if ((result = POSITION.exec(line)) != null) {
                // Add new vertex position
                positions.push(new Vec3Struct(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3])))
            } else if ((result = NORMAL.exec(line)) != null) {
                // Add new vertex normal
                normals.push(new Vec3Struct(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3])))
            } else if ((result = UV.exec(line)) != null) {
                // Add new texture mapping point
                uvs.push(new Vec2Struct(parseFloat(result[1]), 1 - parseFloat(result[2])))
            } else if ((result = FACE.exec(line)) != null) {
                // Add new face
                const vertices = [];
                // Create three vertices from the passed one-indexed indices
                for (let i = 1; i < 10; i += 3) {
                    const part = result.slice(i, i + 3);
                    const position = positions[parseInt(part[0]) - 1];
                    const uv = uvs[parseInt(part[1]) - 1];
                    const normal = normals[parseInt(part[2]) - 1];
                    vertices.push(new VertexStruct(position, normal, uv));
                }
                surfaces.push(new SurfaceStruct(vertices));
            }
        })

        return surfaces;
    }

    // Loads an OBJ file from the given URL, and returns it as a promise
    static loadOBJ = function (url:string) {
        return new Promise(function (resolve) {
            var xhr = new XMLHttpRequest()
            xhr.onreadystatechange = function () {
                if (xhr.readyState == XMLHttpRequest.DONE) {
                    resolve(Geometry.parseOBJ(xhr.responseText))
                }
            }
            xhr.open('GET', url, true)
            xhr.send(null)
        })
    }



    vertexCount() {
        return this.surfaces.length * 3;
    }

    positions() {
        const result = [];
        this.surfaces.forEach(function (surface:Surface) {
            surface.vertices.forEach(function (vertex:Vertex) {
                const v = vertex.position
                result.push(v.x, v.y, v.z)
            })
        })
        return result
    }

    normals() {
        const result = [];
        this.surfaces.forEach(function (surface:Surface) {
            surface.vertices.forEach(function (vertex:Vertex) {
                const v = vertex.normal
                result.push(v.x, v.y, v.z)
            })
        })
        return result
    }

    uvs() {
        const result = [];
        this.surfaces.forEach(function (surface:Surface) {
            surface.vertices.forEach(function (vertex:Vertex) {
                const v = vertex.uv
                result.push(v.x, v.y)
            })
        })
        return result
    }

}

export function SurfaceStruct(vertices: Array < Vertex > ) {
    this.vertices = vertices;
}

export function VertexStruct(position: Position, normal: Normal, uv: UV) {
    this.position = position;
    this.normal = normal;
    this.uv = uv;
}

export function Vec3Struct(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
}

export function Vec2Struct(x: number, y: number) {
    this.x = x;
    this.y = y;
}