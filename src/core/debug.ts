import Transformation from "./transformation";


export default class VertecDebuger {
    constructor(gl: WebGLRenderingContext, pointSize: number) {
       this.transform = new Transformation()
       this.gl = gl;
       this.pColor = [];
       this.pVerts = [];
       this.pVertBuffer = 0;
       this.pVertCount = 0;
       this.pVertComponentLen = 4;
       this.pSize = pointSize;

    }

    gl: WebGLRenderingContext;
    transform: Transformation;
    pColor:any[];
    pVerts: any[];
    pVertBuffer: number;
    pVertCount: number;
    pVertComponentLen: number;
    pSize: number;

    


    

}