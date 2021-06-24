import { ProgramEntrySettings, ShaderProgramMatrixFields } from '@/modules'
import GLContext from './core/glContext'
import {Camera, CameraController }  from './core/camera'
import { GridAxis, GridAxisShader } from './core/primitives/grid/grid'
import { Model, ModelShader } from './core/model'
import Light from './core/light'
import { DirectionalShadow, DirectionalShadowShader } from './core/shadows/directional'
import DepthTexture from './core/Textures/depthTexture'
import { Quad, QuadShader } from './core/primitives/quads/quad'


(async () => {
    const glContext = new GLContext(ProgramEntrySettings.WEBGL_CANVAS_ID)
    glContext.fitScreen(0.95, 0.90).setClearColor(0, 0, 0, 1.0).clear()
    const gl = glContext.getContext() as WebGLRenderingContext

    const lightView = new Camera(gl as WebGLRenderingContext)
    lightView.transform.position.set(0, 5, 5)
    
    const camera = new Camera(gl as WebGLRenderingContext)
    camera.transform.position.set(0, 1, 3)
    new CameraController(gl as WebGLRenderingContext, camera)


    const gridAxisShader = new GridAxisShader(gl as WebGLRenderingContext, camera.projection)
    const gridAxis = GridAxis.createGeometry(gl, false)

    const quadShader = new QuadShader(gl as WebGLRenderingContext, camera.projection)
    const quad = Quad.createGeometry(gl, false)

    const directionalShadowShader = new DirectionalShadowShader(gl as WebGLRenderingContext, lightView.orthoProjection)
    const directionalShadow = await DirectionalShadow.createGeometry(gl, directionalShadowShader, ProgramEntrySettings.PATH_ASSETS_OBJ)

    const modelShader = new ModelShader(gl as WebGLRenderingContext, camera.projection)
    const model = await Model.createGeometry(gl, modelShader, ProgramEntrySettings.PATH_ASSETS_OBJ, ProgramEntrySettings.PATH_ASSETS_TEXTURE)
    model.setScale(0.15,0.15,0.15)

    const light = new Light()

    const loop = () => {
        
        glContext.depthRender(directionalShadow.mesh.depth as DepthTexture).clear()
        lightView.updateViewMatrix()
        directionalShadowShader.activateShader()
            .updateGPU(lightView.viewMatrix, ShaderProgramMatrixFields.CAMERA_MATRIX)
            .renderModel(directionalShadow.preRender())

        glContext.clearFramebuffer().fitScreen(0.95, 0.90).clear()
        camera.updateViewMatrix()
        gridAxisShader.activateShader()
            .updateGPU(camera.viewMatrix, ShaderProgramMatrixFields.CAMERA_MATRIX)
            .renderModel(gridAxis.preRender())

        quadShader.activateShader()
            .updateGPU(camera.viewMatrix, ShaderProgramMatrixFields.CAMERA_MATRIX)
            .renderModel(quad.preRender())

        modelShader.activateShader()
            .updateGPU(camera.viewMatrix, ShaderProgramMatrixFields.CAMERA_MATRIX)
            .renderModel(model.preRender())
            
        light.useLight(modelShader, camera)

        requestAnimationFrame(loop)
    }
    loop()
})()