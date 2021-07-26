import { PATH_ASSETS_OBJ, PATH_ASSETS_TEXTURE, ProgramEntrySettings } from "./modules"
import { Camera, CameraController } from "./core/camera"
import GLContext from "./core/glContext"
import Light from "./core/light"
import { Vector3 } from "./core/math"
import { DirectionalShadow, DirectionalShadowShader } from "./core/shadows/directional"
import { InfiniteGrid, InfiniteGridShader } from "./core/primitives/grid/infinite"
import { Model, ModelShader } from "./core/model"
import DepthTexture from "./core/Textures/depthTexture"


(async()=>{
    const glContext = new GLContext(ProgramEntrySettings.WEBGL_CANVAS_ID)
    glContext.fitScreen(0.95, 0.90).setClearColor(13, 17, 23, 1.0).clear()
    const gl = glContext.getContext() as WebGLRenderingContext

    const lightViewPosition = new Vector3(0, 2.5, 3)
    const lightView = new Light(lightViewPosition)
    const lightCameraView = new Camera(gl as WebGLRenderingContext)
    lightCameraView.transform.position.set(lightViewPosition.x, lightViewPosition.y, lightViewPosition.z)

    const directionalShadowShader = new DirectionalShadowShader(gl as WebGLRenderingContext, lightCameraView)
    const directionalShadow = await DirectionalShadow.createGeometry(gl, directionalShadowShader, PATH_ASSETS_OBJ)
    
    const camera = new Camera(gl as WebGLRenderingContext)
    camera.transform.position.set(0, 0.5, 1.5)
    new CameraController(gl as WebGLRenderingContext, camera)

    const infiniteGridShader = new InfiniteGridShader(gl as WebGLRenderingContext, camera, lightCameraView)
    const infiniteGrid = await InfiniteGrid.createGeometry(gl, infiniteGridShader)

    const modelShader = new ModelShader(gl as WebGLRenderingContext, camera, lightCameraView)
    const model = await Model.createGeometry(gl, modelShader, PATH_ASSETS_OBJ, PATH_ASSETS_TEXTURE)
    model.setScale(0.0035,0.0035,0.0035).setRotation(0,30,0)

    const loop = () => {
        // rendering scene depth
        glContext.depthRender(directionalShadow.mesh.depth as DepthTexture)
        lightCameraView.updateViewMatrix()
        directionalShadowShader.setUniforms(gl, directionalShadow.preRender()).shaderProgram
            .renderModel(directionalShadow.preRender() )
        glContext.clearFramebuffer().fitScreen(0.95, 0.90).clear()


        camera.updateViewMatrix()

        infiniteGridShader.setUniforms(gl, infiniteGrid.preRender()).shaderProgram
            .renderModel(infiniteGrid.preRender())

        modelShader.setUniforms(gl, model.preRender())
            .shaderProgram.renderModel(model.preRender())

        lightView.setUniforms(gl, modelShader, camera)

        requestAnimationFrame(loop)
    }
    loop()
})()