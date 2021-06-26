import { ProgramEntrySettings } from '@/modules'
import GLContext from './core/glContext'
import { Camera, CameraController }  from './core/camera'
import { GridAxis, GridAxisShader } from './core/primitives/grid/grid'
import { Model, ModelShader } from './core/model'
import { DirectionalShadow, DirectionalShadowShader } from './core/shadows/directional'
import Light from './core/light'
import DepthTexture from './core/Textures/depthTexture'


(async () => {
    const glContext = new GLContext(ProgramEntrySettings.WEBGL_CANVAS_ID)
    glContext.fitScreen(0.95, 0.90).setClearColor(0, 0, 0, 1.0).clear()
    const gl = glContext.getContext() as WebGLRenderingContext

    const lightViewCamera = new Camera(gl as WebGLRenderingContext)
    lightViewCamera.transform.position.set(0, 1, 3)

    const directionalShadowShader = new DirectionalShadowShader(gl as WebGLRenderingContext, lightViewCamera.orthoProjection)
    const directionalShadow = await DirectionalShadow.createGeometry(gl, directionalShadowShader, ProgramEntrySettings.PATH_ASSETS_OBJ)
    
    const camera = new Camera(gl as WebGLRenderingContext)
    camera.transform.position.set(0, 1, 3)
    new CameraController(gl as WebGLRenderingContext, camera)

    const gridAxisShader = new GridAxisShader(gl as WebGLRenderingContext, camera)
    const gridAxis = GridAxis.createGeometry(gl, gridAxisShader, false)

    const modelShader = new ModelShader(gl as WebGLRenderingContext, camera)
    const model = await Model.createGeometry(gl, modelShader, ProgramEntrySettings.PATH_ASSETS_OBJ, ProgramEntrySettings.PATH_ASSETS_TEXTURE)
    model.setScale(0.15,0.15,0.15)

    const light = new Light()

    const loop = () => {
        
        glContext.depthRender(directionalShadow.mesh.depth as DepthTexture)
        lightViewCamera.updateViewMatrix()

        directionalShadowShader.shaderProgram.activateShader()
            .setUniforms(lightViewCamera.viewMatrix, directionalShadowShader.cameraMatrix as WebGLUniformLocation )
            .renderModel(directionalShadow.preRender(), directionalShadowShader.modelViewMatrix as WebGLUniformLocation )

    
        glContext.clearFramebuffer().fitScreen(0.95, 0.90).clear()

        camera.updateViewMatrix()
        gridAxisShader.setUniforms(gl).shaderProgram
            .renderModel(gridAxis.preRender(), gridAxisShader.modelViewMatrix as WebGLUniformLocation )

        modelShader.setUniforms(gl).shaderProgram
            .renderModel(model.preRender(), modelShader.modelViewMatrix as WebGLUniformLocation )

        light.setUniforms(gl, modelShader, camera)

        requestAnimationFrame(loop)
    }
    loop()
})()