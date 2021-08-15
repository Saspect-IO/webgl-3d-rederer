import { Normal, UV, Vector, Vertex } from "@/entities";

export const SurfaceStruct = (vertices: Array < Vertex > ) => ({ vertices })
export const VertexStruct = (position: Vector, normal: Normal, uv: UV) => ({ position, normal, uv })
export const Vec3Struct = (x: number, y: number, z: number) => ({ x, y, z })
export const Vec2Struct = (x: number, y: number) => ({ x, y })
export const radToDeg = (r: number) => r * 180 / Math.PI
export const degToRad = (d: number) => d * Math.PI / 180
export const normalize = (val:number, max:number, min:number)=>((val-min)/(max-min))
export const lerp = (norm:number, min:number, max:number)=>((norm*(max-min))+min)
export const normalizeRGB = ({ red, green, blue }:{red: number, green: number, blue: number})=>{

    const rgb_8_bit = 255
    const errorMessage = 'band out of range each value must be from 1 - 255'

    if (red <= 0 ||red > rgb_8_bit) {
        throw new Error(`value ${red} for red ${errorMessage}`);
    } else if (green <= 0 ||green > rgb_8_bit) {
        throw new Error(`value ${green} for green ${errorMessage}`);
    }if (blue <= 0 ||blue > rgb_8_bit) {
        throw new Error(`value ${blue} for blue ${errorMessage}`);
    }

    const alpha = 1
    const result=[normalize(red, rgb_8_bit, 0), normalize(blue, rgb_8_bit, 0), normalize(green, rgb_8_bit, 0), alpha]
    return new Float32Array(result)
}