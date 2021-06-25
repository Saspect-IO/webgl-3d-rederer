import { ModelShader } from "@/core/model";
import Texture from "@/core/Textures/texture";
import { MeshData } from "@/entities";
import { GLSetttings } from "@/modules";
import Geometry from "../../geometry";
import Vbuffer from "../../vbuffer";

class Quad {

  constructor() {}
  
  static async createGeometry(gl:WebGLRenderingContext,shaderProgram: ModelShader, textureSrc: string){ 
    return new Geometry( await Quad.createMesh(gl, shaderProgram, textureSrc)); 
  }

  static async createMesh(glContext: WebGLRenderingContext, shaderProgram: ModelShader, textureSrc: string ) {

    //Dynamiclly create a quad
    let gl = glContext as WebGLRenderingContext;
    let verts = [ 0,0,0, 1,0,0, 1,0,1, 0,0,0 ],
    uvs = [ 0,0, 0,1, 1,1, 1,0 ],
    indices = [ 0,1,3, 1,2,3 ]

    const texture = await Quad.loadTexture(gl, textureSrc);
    const vertexCount = verts.length / GLSetttings.GRID_VERTEX_LEN;

    const mesh: MeshData = {
      positions: new Vbuffer(gl, verts, vertexCount, GLSetttings.BUFFER_TYPE_VERTICES),
      drawMode: gl.TRIANGLES,
      uvs: new Vbuffer(gl, uvs, vertexCount, GLSetttings.BUFFER_TYPE_VERTICES),
      texture,
      indices: new Vbuffer(gl, indices, vertexCount, GLSetttings.BUFFER_TYPE_INDICES),
      vertexCount,
      noCulling: true,
      doBlending: true,
    }
    
    mesh.positions.bindToAttribute(shaderProgram.positionLoc as number, GLSetttings.DEFAULT_STRIDE, GLSetttings.DEFAULT_OFFSET);
    mesh.normals?.bindToAttribute(shaderProgram.normalLoc as number, GLSetttings.DEFAULT_STRIDE, GLSetttings.DEFAULT_OFFSET);
    mesh.uvs?.bindToAttribute(shaderProgram.texCoordLoc as number, GLSetttings.DEFAULT_STRIDE, GLSetttings.DEFAULT_OFFSET);

    mesh.indices?.bindToAttribute(indices, GLSetttings.DEFAULT_STRIDE, GLSetttings.DEFAULT_OFFSET, 0, GLSetttings.BUFFER_TYPE_INDICES)


    return mesh;
  }

  static async loadTexture(gl: WebGLRenderingContext, textureSrc: string) {
    const texture = await Texture.loadTexture(gl, textureSrc);
    return texture;
  }
}

export {
  // QuadShader,
  Quad
}