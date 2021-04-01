//--------------------------------------------------
// Global Constants 

import {
    ProgramEntrySettings,
    GLSetttings
} from "../modules";

//--------------------------------------------------
// Custom GL Context Object
//--------------------------------------------------
export default class GLContext {

    constructor(WEBGL_CANVAS_ID: string) {

        const canvas = document.getElementById(WEBGL_CANVAS_ID) as HTMLCanvasElement;

        ([
            ProgramEntrySettings.WEBGL_CONTEXT,
            ProgramEntrySettings.WEBGL_CONTEXT_EXPERIMENTAL,
            ProgramEntrySettings.WEBGL_CONTEXT_WEBKIT,
            ProgramEntrySettings.WEBGL_CONTEXT_MOZ
        ]).some(option => this.gl = canvas.getContext(option) as WebGLRenderingContext);

        this.gl ?? alert(ProgramEntrySettings.WEBGL_CONTEXT_ERROR_MESSAGE);
        this.gl?.clearColor(0.0, 0.0, 0.0, 1.0);//Set clear color

        this.gl?.enable(this.gl.CULL_FACE);
        this.gl?.enable(this.gl.DEPTH_TEST);

    }

    gl: WebGLRenderingContext | null = null;
    rgb_32_bit = 255;
    alpha = 1;

    //...................................................
    //Setup custom properties
    mMeshCache:{[id:string]: any}[] = []; //Cache all the mesh structs, easy to unload buffers if they all exist in one place.


    //Reset the canvas with our set background color.	
    fClear() {
        (this.gl as WebGLRenderingContext).clear((this.gl as WebGLRenderingContext).COLOR_BUFFER_BIT | (this.gl as WebGLRenderingContext).DEPTH_BUFFER_BIT);
        return this;
    }

    //Create and fill our Array buffer.
    fCreateArrayBuffer(floatAry:Float32Array, isStatic:boolean) {
        if (isStatic === undefined) isStatic = true; //So we can call (this.gl as WebGLRenderingContext) function without setting isStatic

        let buf = (this.gl as WebGLRenderingContext).createBuffer();
        (this.gl as WebGLRenderingContext).bindBuffer((this.gl as WebGLRenderingContext).ARRAY_BUFFER, buf);
        (this.gl as WebGLRenderingContext).bufferData((this.gl as WebGLRenderingContext).ARRAY_BUFFER, floatAry, (isStatic) ? (this.gl as WebGLRenderingContext).STATIC_DRAW : (this.gl as WebGLRenderingContext).DYNAMIC_DRAW);
        (this.gl as WebGLRenderingContext).bindBuffer((this.gl as WebGLRenderingContext).ARRAY_BUFFER, null);
        return buf;
    }

    //Turns arrays into GL buffers, then setup a VAO that will predefine the buffers to standard shader attributes.
    fCreateMeshVAO(name, aryInd, aryVert, aryNorm, aryUV) {
        let rtn: any = {
            drawMode: (this.gl as WebGLRenderingContext).TRIANGLES
        };

        //Create and bind vao
        rtn.vao = (this.gl as WebGLRenderingContext).createVertexArray();
        (this.gl as WebGLRenderingContext).bindVertexArray(rtn.vao); //Bind it so all the calls to vertexAttribPointer/enableVertexAttribArray is saved to the vao.

        //.......................................................
        //Set up vertices
        if (aryVert !== undefined && aryVert != null) {
            rtn.bufVertices = (this.gl as WebGLRenderingContext).createBuffer(); //Create buffer...
            rtn.vertexComponentLen = 3; //How many floats make up a vertex
            rtn.vertexCount = aryVert.length / rtn.vertexComponentLen; //How many vertices in the array

            (this.gl as WebGLRenderingContext).bindBuffer((this.gl as WebGLRenderingContext).ARRAY_BUFFER, rtn.bufVertices);
            (this.gl as WebGLRenderingContext).bufferData((this.gl as WebGLRenderingContext).ARRAY_BUFFER, new Float32Array(aryVert), (this.gl as WebGLRenderingContext).STATIC_DRAW); //then push array into it.
            (this.gl as WebGLRenderingContext).enableVertexAttribArray(GLSetttings.ATTR_POSITION_LOC); //Enable Attribute location
            (this.gl as WebGLRenderingContext).vertexAttribPointer(GLSetttings.ATTR_POSITION_LOC, 3, (this.gl as WebGLRenderingContext).FLOAT, false, 0, 0); //Put buffer at location of the vao
        }

        //.......................................................
        //Setup normals
        if (aryNorm !== undefined && aryNorm != null) {
            rtn.bufNormals = (this.gl as WebGLRenderingContext).createBuffer();
            (this.gl as WebGLRenderingContext).bindBuffer((this.gl as WebGLRenderingContext).ARRAY_BUFFER, rtn.bufNormals);
            (this.gl as WebGLRenderingContext).bufferData((this.gl as WebGLRenderingContext).ARRAY_BUFFER, new Float32Array(aryNorm), (this.gl as WebGLRenderingContext).STATIC_DRAW);
            (this.gl as WebGLRenderingContext).enableVertexAttribArray(GLSetttings.ATTR_NORMAL_LOC);
            (this.gl as WebGLRenderingContext).vertexAttribPointer(GLSetttings.ATTR_NORMAL_LOC, 3, (this.gl as WebGLRenderingContext).FLOAT, false, 0, 0);
        }

        //.......................................................
        //Setup UV
        if (aryUV !== undefined && aryUV != null) {
            rtn.bufUV = (this.gl as WebGLRenderingContext).createBuffer();
            (this.gl as WebGLRenderingContext).bindBuffer((this.gl as WebGLRenderingContext).ARRAY_BUFFER, rtn.bufUV);
            (this.gl as WebGLRenderingContext).bufferData((this.gl as WebGLRenderingContext).ARRAY_BUFFER, new Float32Array(aryUV), (this.gl as WebGLRenderingContext).STATIC_DRAW);
            (this.gl as WebGLRenderingContext).enableVertexAttribArray(GLSetttings.ATTR_UV_LOC);
            (this.gl as WebGLRenderingContext).vertexAttribPointer(GLSetttings.ATTR_UV_LOC, 2, (this.gl as WebGLRenderingContext).FLOAT, false, 0, 0); //UV only has two floats per component
        }

        //.......................................................
        //Setup Index.
        if (aryInd !== undefined && aryInd != null) {
            rtn.bufIndex = (this.gl as WebGLRenderingContext).createBuffer();
            rtn.indexCount = aryInd.length;
            (this.gl as WebGLRenderingContext).bindBuffer((this.gl as WebGLRenderingContext).ELEMENT_ARRAY_BUFFER, rtn.bufIndex);
            (this.gl as WebGLRenderingContext).bufferData((this.gl as WebGLRenderingContext).ELEMENT_ARRAY_BUFFER, new Uint16Array(aryInd), (this.gl as WebGLRenderingContext).STATIC_DRAW);
            (this.gl as WebGLRenderingContext).bindBuffer((this.gl as WebGLRenderingContext).ELEMENT_ARRAY_BUFFER, null);
        }

        //Clean up
        (this.gl as WebGLRenderingContext).bindVertexArray(null); //Unbind the VAO, very Important. always unbind when your done using one.
        (this.gl as WebGLRenderingContext).bindBuffer((this.gl as WebGLRenderingContext).ARRAY_BUFFER, null); //Unbind any buffers that might be set

        this.mMeshCache[name] = rtn;
        return rtn;
    }


    //...................................................
    //Setters - Getters

    //Set the size of the canvas html element and the rendering view port
    fSetSize(w:number, h:number) {
        //set the size of the canvas, on chrome we need to set it 3 ways to make it work perfectly.
        (this.gl as WebGLRenderingContext).canvas.style.width = w + "px";
        (this.gl as WebGLRenderingContext).canvas.style.height = h + "px";
        (this.gl as WebGLRenderingContext).canvas.width = w;
        (this.gl as WebGLRenderingContext).canvas.height = h;

        //when updating the canvas size, must reset the viewport of the canvas 
        //else the resolution webgl renders at will not change
        (this.gl as WebGLRenderingContext).viewport(0, 0, w, h);
        return this;
    }

    //Set the size of the canvas to fill a % of the total screen.
    fFitScreen(wp:number, hp:number) {
        return this.fSetSize(window.innerWidth * (wp || 1), window.innerHeight * (hp || 1));
    }

}