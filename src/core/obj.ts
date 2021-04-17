import {
    Normal,
    Vector,
    Surface,
    UV,
    Vertex
} from "@/entities";
import { SurfaceStruct, Vec2Struct, Vec3Struct, VertexStruct } from "@/modules";

export default class OBJ {

    constructor(surfaces: Array < Surface > ) {
        this.surfaces = surfaces;
    }

    surfaces: Surface[] = [];
    vertices: Vertex[] = [];
    position: Vector | null = null;
    normal: Normal | null = null;
    uv: UV | null = null;
    x: number = 0;
    y: number = 0;
    z: number = 0;

    static parseOBJ(src: string) {

        const POSITION = /^v\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)/
        const NORMAL = /^vn\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)/
        const UV = /^vt\s+([\d\.\+\-eE]+)\s+([\d\.\+\-eE]+)/
        const SURFACE = /^f\s+(-?\d+)\/(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)\/(-?\d+)(?:\s+(-?\d+)\/(-?\d+)\/(-?\d+))?/

        const lines = src.split('\n');
        const positions: Vector[] = [];
        const uvs: UV[] = [];
        const normals: Normal[] = [];
        const surfaces: Surface[] = [];

        lines.forEach(function (line: string) {
            // Match each line of the file against various RegEx-es
            let result = null;
            if ((result = POSITION.exec(line)) !== null) {
                // Add new vertex position
                positions.push(Vec3Struct(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3])))
            } else if ((result = NORMAL.exec(line)) !== null) {
                // Add new vertex normal
                normals.push(Vec3Struct(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3])))
            } else if ((result = UV.exec(line)) !== null) {
                // Add new texture mapping point
                uvs.push(Vec2Struct(parseFloat(result[1]), 1 - parseFloat(result[2])))
            } else if ((result = SURFACE.exec(line)) !== null) {
                // Add new face
                const vertices: Vertex[] = [];
                // Create three vertices from the passed one-indexed indices
                for (let i = 1; i < 10; i += 3) {
                    const part = result.slice(i, i + 3);
                    const position = positions[parseInt(part[0]) - 1];
                    const uv = uvs[parseInt(part[1]) - 1];
                    const normal = normals[parseInt(part[2]) - 1];
                    vertices.push(VertexStruct(position, normal, uv));
                }
                surfaces.push(SurfaceStruct(vertices));
            }
        })

        return new OBJ(surfaces);
    }

    // Loads an OBJ file from the given URL, and returns it as a promise
    static async loadOBJ(url: string) {
        const response = await fetch(url);
        const data = OBJ.parseOBJ(await response.text());
        return data;
    }

    vertexCount() {
        return this.surfaces.length * 3;
    }

    positions() {
        const result: number[] = [];
        this.surfaces.forEach(function (surface: Surface) {
            surface.vertices.forEach(function (vertex: Vertex) {
                const v = vertex.position;
                result.push(v.x, v.y, v.z);
            })
        })
        return result;
    }

    normals() {
        const result: number[] = [];
        this.surfaces.forEach(function (surface: Surface) {
            surface.vertices.forEach(function (vertex: Vertex) {
                const v = vertex.normal;
                result.push(v.x, v.y, v.z);
            })
        })
        return result;
    }

    uvs() {
        const result: number[] = [];
        this.surfaces.forEach(function (surface: Surface) {
            surface.vertices.forEach(function (vertex: Vertex) {
                const v = vertex.uv;
                result.push(v.x, v.y);
            })
        })
        return result;
    }

}