import { Normal, UV, Vector, Vertex } from "@/entities";

export const SurfaceStruct = (vertices: Array < Vertex > ) => ({ vertices })
export const VertexStruct = (position: Vector, normal: Normal, uv: UV) => ({ position, normal, uv })
export const Vec3Struct = (x: number, y: number, z: number) => ({ x, y, z })
export const Vec2Struct = (x: number, y: number) => ({ x, y })
export const radToDeg = (r: number) => r * 180 / Math.PI
export const degToRad = (d: number) => d * Math.PI / 180
export const normalizeColor = ({ red, green, blue }:{red: number, green: number, blue: number})=>{

    if (red > 255 || green > 255 || blue > 255) {
        return new Float32Array([1,1,1,1])
    }

    if (red <= 0 || green <= 0 || blue <= 0) {
        return new Float32Array([0,0,0,0])
    }

    const alpha = 1
    const rgb_32_bit = 255

    const result=[(red/rgb_32_bit), (green/rgb_32_bit), (blue/rgb_32_bit), alpha]
    return new Float32Array(result)
}
