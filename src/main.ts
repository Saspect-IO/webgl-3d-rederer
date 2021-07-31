import { PATH_ASSETS_OBJ, PATH_ASSETS_TEXTURE, ProgramEntrySettings } from "./modules"
import { Camera, CameraController } from "./core/camera"
import GLContext from "./core/glContext"
import Light from "./core/light"
import { Vector3 } from "./core/math"
import { InfiniteGrid, InfiniteGridShader } from "./core/primitives/grid/infinite"
import { Model, ModelShader } from "./core/model"
import ObjLoader from "./core/objLoader"
import Texture from "./core/Textures/texture"


(async()=>{
    const glContext = new GLContext(ProgramEntrySettings.WEBGL_CANVAS_ID)
    const [wp, wh] = [0.95, 0.90]
    glContext.fitScreen(wp, wh).setClearColor(13, 17, 23, 1.0).clear()
    const gl = glContext.getContext() as WebGLRenderingContext

    const lightViewPosition = new Vector3(0, 2.5, 3)
    const lightView = new Light(lightViewPosition)
    const lightCameraView = new Camera(gl as WebGLRenderingContext)
    lightCameraView.transform.position.set(lightViewPosition.x, lightViewPosition.y, lightViewPosition.z)

    const vertices = await ObjLoader.loadOBJ(PATH_ASSETS_OBJ)
    const texture = await Texture.loadTexture(gl, PATH_ASSETS_TEXTURE)
    
    const camera = new Camera(gl as WebGLRenderingContext)
    camera.transform.position.set(0, 0.5, 1.5)
    new CameraController(gl as WebGLRenderingContext, camera)

    const infiniteGridShader = new InfiniteGridShader(gl as WebGLRenderingContext, camera, lightCameraView)
    const infiniteGrid = InfiniteGrid.createGeometry(gl, infiniteGridShader)

    const modelShader = new ModelShader(gl as WebGLRenderingContext, camera, lightCameraView)
    const model = Model.createGeometry(gl, modelShader, vertices, texture)
    model.setScale(0.0035,0.0035,0.0035).setRotation(0,30,0)

    const loop = () => {

        camera.updateViewMatrix()

        infiniteGridShader.setUniforms(gl, infiniteGrid.preRender()).shaderProgram
            .renderModel(infiniteGrid.preRender())

        modelShader.setUniforms(gl, model.preRender())
            .shaderProgram.renderModel(model.preRender())

        lightView.setUniforms(gl, modelShader)

        requestAnimationFrame(loop)
    }
    loop()
})()