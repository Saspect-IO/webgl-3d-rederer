import { Normal, Vector, Surface, UV, Vertex } from "@/entities";
import { END_OF_LINE, NEW_LINE, ObjTypes, BACKSLASH, SPACE, SurfaceStruct, Vec2Struct, Vec3Struct, VertexStruct } from "@/modules";

export default class ObjLoader {

    constructor(surfaces: Array < Surface > ) {
        this.surfaces = surfaces;
    }

    surfaces: Surface[] = [];

    static parseOBJ(src: string) {

        const POSITION = ObjTypes.V
        const NORMAL = ObjTypes.VN
        const UV = ObjTypes.VT
        const SURFACE = ObjTypes.F

        const lines = src.split(NEW_LINE);
        const positions: Vector[] = [];
        const uvs: UV[] = [];
        const normals: Normal[] = [];
        const surfaces: Surface[] = [];
       
        lines.forEach(function (item: string) {
            // Match each line of the file against various RegEx-es
            const lineStart = 0
            const lineEnd = item.indexOf(END_OF_LINE, 0)
            const line = item.substring(lineStart, lineEnd).trim()
            const lineItems = line.split(SPACE)
            const type = lineItems[0]

            if ( POSITION === type) {
                // Add new vertex position
                positions.push(Vec3Struct(parseFloat(lineItems[1]), parseFloat(lineItems[2]), parseFloat(lineItems[3])))
            } else if (NORMAL  === type) {
                // Add new vertex normal
                normals.push(Vec3Struct(parseFloat(lineItems[1]), parseFloat(lineItems[2]), parseFloat(lineItems[3])))
            } else if (UV === type) {
                // Add new texture mapping point
                uvs.push(Vec2Struct(parseFloat(lineItems[1]), 1 - parseFloat(lineItems[2])))
            } else if (SURFACE === type) {
                // Add new face
                const vertices: Vertex[] = [];
                // Create three vertices from the passed one-indexed indices
                for (let i = 1; i < 4; i ++) {
                    const part = lineItems[i].split(BACKSLASH)
                    const position = positions[parseInt(part[0]) - 1]
                    const uv = uvs[parseInt(part[1]) - 1]
                    const normal = normals[parseInt(part[2]) - 1]
                    vertices.push(VertexStruct(position, normal, uv))
                }
                surfaces.push(SurfaceStruct(vertices))
            }
        })

        return new ObjLoader(surfaces);
    }

    static async loadOBJ(url: string) {
        const response = await fetch(url);
        const data = ObjLoader.parseOBJ(await response.text());
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