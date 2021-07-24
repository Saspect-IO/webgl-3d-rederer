import { Normal, Vector, Surface, UV, Vertex } from "@/entities";
import { END_OF_LINE, NEW_LINE, ObjTypes, BACKSLASH, SPACE, SurfaceStruct, Vec2Struct, Vec3Struct, VertexStruct } from "@/modules";

export default class ObjLoader {

    constructor(surfaces: Array < Surface > ) {
        this.surfaces = surfaces;
    }

    surfaces: Surface[] = [];

    static async parseOBJ(src: string) {

        const POSITION = ObjTypes.V
        const NORMAL = ObjTypes.VN
        const UV = ObjTypes.VT
        const SURFACE = ObjTypes.F

        const lines = src.split(NEW_LINE);
        const positions: Vector[] = [];
        const uvs: UV[] = [];
        const normals: Normal[] = [];
        const surfaces: Surface[] = [];
       
        lines.map(function(item: string) {
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
                let isQuad = false
                let shouldExit = false
                let size = 4
                // Add new face
                const vertices: Vertex[] = [];

                // conditionally detect and parse quads to triangle
                for (let i = 1; i < size; i ++) {
                    if (lineItems.length>size && !shouldExit) {
                        size+=1
                    }else if (i===4 && !isQuad) {
                        i = 3
                        size+=1
                        isQuad = true
                    }else if (i===5 && isQuad) {
                        i=1
                        isQuad = false
                        shouldExit = true
                    } else if(i===2 && shouldExit){
                        break
                    }
                    const part = lineItems[i].split(BACKSLASH)
                    const position = positions[parseInt(part[0]) - 1]
                    const uv = uvs[parseInt(part[1]) - 1]
                    const normal = normals[parseInt(part[2]) - 1]
                    vertices.push(VertexStruct(position, normal, uv))
                }
                
                // split tesselated quads as individual surfaces
                if (vertices.length>3) {
                    const triagle1 = vertices.slice(0,3)
                    const triangle2 = vertices.slice(3)
                    surfaces.push(SurfaceStruct(triagle1))
                    surfaces.push(SurfaceStruct(triangle2))
                }else{
                    surfaces.push(SurfaceStruct(vertices))
                }
                
            }
        })

        return new ObjLoader(surfaces);
    }

    static async loadOBJ(url: string) {
        const response = await fetch(url);
        const data = await response.text()
        const result = await ObjLoader.parseOBJ(data);
        return result;
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