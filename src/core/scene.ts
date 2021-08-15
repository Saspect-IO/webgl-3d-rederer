import AppLoader from "@/app/components/core/appLoader"
import { PATH_ASSETS_OBJ, PATH_ASSETS_TEXTURE, ProgramEntrySettings } from "@/modules"
import { Camera, CameraController } from "./camera"
import GLContext from "./glContext"
import Light from "./light"
import { Vector3 } from "./math"
import { Model, ModelShader } from "./model"
import ObjLoader from "./objLoader"
import { InfiniteGrid, InfiniteGridShader } from "./primitives/grid/infinite"
import Texture from "./Textures/texture"

export default class Scene {
    constructor(){
        (async()=>{
            const appLoader = new AppLoader()
            
            const glContext = new GLContext(ProgramEntrySettings.WEBGL_CANVAS_ID)
            const [wp, wh] = [0.95, 0.90]
            glContext.fitScreen(wp, wh).setClearColor(13, 17, 23, 1.0).clear()
            const gl = glContext.getContext() as WebGLRenderingContext

            const lightPosition = new Vector3(0, 2.5, 3)
            const light1 = new Light(lightPosition)
            const lightViewCamera = new Camera(gl as WebGLRenderingContext)
            lightViewCamera.transform.position.set(lightPosition.x, lightPosition.y, lightPosition.z)

            const vertices = await ObjLoader.loadOBJ(PATH_ASSETS_OBJ)
            const texture = await Texture.loadTexture(gl, PATH_ASSETS_TEXTURE)
            
            const camera = new Camera(gl as WebGLRenderingContext)
            camera.transform.position.set(0, 0.5, 1.5)
            new CameraController(gl as WebGLRenderingContext, camera)

            const infiniteGridShader = new InfiniteGridShader(gl as WebGLRenderingContext, camera)
            const infiniteGrid = InfiniteGrid.createGeometry(gl, infiniteGridShader)

            const modelShader = new ModelShader(gl as WebGLRenderingContext, camera, lightViewCamera)
            const model = Model.createGeometry(gl, modelShader, vertices, texture)
            model.setScale(0.0035,0.0035,0.0035).setRotation(0,30,0)

            appLoader.disable()

            const loop = () => {

                camera.updateViewMatrix()

                infiniteGridShader.setUniforms(gl).shaderProgram
                    .renderModel(infiniteGrid.preRender())

                modelShader.setUniforms(gl, model.preRender())
                    .shaderProgram.renderModel(model.preRender())

                light1.setUniforms(gl, modelShader)

                requestAnimationFrame(loop)
            }
            loop()
        })()

    }
}