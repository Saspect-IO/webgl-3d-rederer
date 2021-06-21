import { ProgramEntrySettings, ShaderProgramMatrixFields } from '@/modules'
import GLContext from './core/glContext'
import {Camera, CameraController }  from './core/camera'
import { GridAxis, GridAxisShader } from './core/primitives/grid/grid'
import { Model, ModelShader } from './core/models/model'
import Light from './core/light'
import { DirectionalShadow, DirectionalShadowShader } from './core/shadows/directional'


(async () => {
    const glContext = new GLContext(ProgramEntrySettings.WEBGL_CANVAS_ID)
    glContext.fitScreen(0.95, 0.90).setClearColor(0, 0, 0, 1.0).clear()
    const gl = glContext.getContext() as WebGLRenderingContext

    const lightView = new Camera(gl as WebGLRenderingContext)
    lightView.transform.position.set(50, 50, 50)
    
    const camera = new Camera(gl as WebGLRenderingContext)
    camera.transform.position.set(0, 1, 3)
    new CameraController(gl as WebGLRenderingContext, camera)

    const gridAxisShader = new GridAxisShader(gl as WebGLRenderingContext, camera.projection)
    const gridAxis = GridAxis.createGeometry(gl, false)

    const directionalShadowShader = new DirectionalShadowShader(gl as WebGLRenderingContext, lightView.orthoProjection)
    const directionalShadow = await DirectionalShadow.createGeometry(gl, directionalShadowShader, ProgramEntrySettings.PATH_ASSETS_OBJ)

    const modelShader = new ModelShader(gl as WebGLRenderingContext, camera.projection)
    const model = await Model.createGeometry(gl, modelShader, ProgramEntrySettings.PATH_ASSETS_OBJ, ProgramEntrySettings.PATH_ASSETS_TEXTURE)
    model.setScale(0.15,0.15,0.15)

    const light = new Light()

    const loop = () => {
        
        lightView.updateViewMatrix()
        glContext.clear()
        
        directionalShadowShader.activateShader()
            .updateGPU(lightView.viewMatrix, ShaderProgramMatrixFields.CAMERA_MATRIX)
            .renderModel(directionalShadow.preRender())

        glContext.clearFramebuffer().clear()

        camera.updateViewMatrix()
        glContext.clear()

        gridAxisShader.activateShader()
            .updateGPU(camera.viewMatrix, ShaderProgramMatrixFields.CAMERA_MATRIX)
            .renderModel(gridAxis.preRender())

        modelShader.activateShader()
            .updateGPU(camera.viewMatrix, ShaderProgramMatrixFields.CAMERA_MATRIX)
            .renderModel(model.preRender())
            
        light.useLight(modelShader, camera)

        requestAnimationFrame(loop)
    }
    loop()
})()