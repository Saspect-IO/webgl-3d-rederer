import { Normal, UV, Vector, Vertex } from "@/entities";

export const SurfaceStruct = (vertices: Array < Vertex > ) => ({ vertices })
export const VertexStruct = (position: Vector, normal: Normal, uv: UV) => ({ position, normal, uv })
export const Vec3Struct = (x: number, y: number, z: number) => ({ x, y, z })
export const Vec2Struct = (x: number, y: number) => ({ x, y })
export const radToDeg = (r: number) => r * 180 / Math.PI
export const degToRad = (d: number) => d * Math.PI / 180
export const loadShaders = async (vsSource: string, fsSource: string) => {

    const loadFile = async (src: string) => {
        const response = await fetch(src)
        const data = await response.text()
        return data
    }

    const [vertexShaderFile, fragmentShaderFile] = await Promise.all([loadFile(vsSource), loadFile(fsSource)])

    return {
        vertexShaderFile,
        fragmentShaderFile
    };
}

export const mapValues = (x: number, xMin: number, xMax: number, zMin: number, zMax: number) => ( ((x-xMin)/(xMax-xMin)) * ((zMax-zMin)+zMin) )

export const normalizeColor = (rgb:{red: number, green: number, blue: number})=>{
    const alpha = 1
    const rgb_32_bit = 255

    const result=[(rgb.red/rgb_32_bit), (rgb.green/rgb_32_bit), (rgb.blue/rgb_32_bit), alpha]
    return new Float32Array(result)

}
