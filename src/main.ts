import { ProgramEntrySettings, ShaderProgramMatrixFields } from '@/modules'
import GLExtend from './core/glContext'
import {Camera, CameraController }  from './core/camera'
import { GridAxis, GridAxisShader } from './core/primitives/grid/grid'
import { Model, ModelShader } from './core/models/model'
import Light from './core/light'
import { DirectionalShadowShader } from './core/shadows/directional'
import DepthTexture from './core/Textures/depthTexture'


(async () => {
    const glExtend = new GLExtend(ProgramEntrySettings.WEBGL_CANVAS_ID)
    const gl = glExtend.getContext() as WebGLRenderingContext

    const depthTexturePass = new DepthTexture(gl, ProgramEntrySettings.DEPTH_TEXTURE_SIZE)
    glExtend.setFrambuffer(depthTexturePass.depthTextureSize, depthTexturePass.depthFramebuffer as WebGLFramebuffer).clear()

    const lightView = new Camera(gl as WebGLRenderingContext)
    lightView.transform.position.set(0, 1, 3)

    const camera = new Camera(gl as WebGLRenderingContext)
    camera.transform.position.set(50, 50, 50)

    new CameraController(gl as WebGLRenderingContext, camera)

    const directionalShadowShader = new DirectionalShadowShader(gl as WebGLRenderingContext, lightView.orthoProjection)

    const gridAxisShader = new GridAxisShader(gl as WebGLRenderingContext, camera.projection)
    const gridAxis = GridAxis.createGeometry(gl, false)

    const modelShader = new ModelShader(gl as WebGLRenderingContext, camera.projection)
    const model = await Model.createGeometry(gl, modelShader, ProgramEntrySettings.PATH_ASSETS_OBJ, ProgramEntrySettings.PATH_ASSETS_TEXTURE)
    model.setScale(0.15,0.15,0.15)

    const light = new Light()

    glExtend.clearFramebuffer().fitScreen(0.95, 0.90).setClearColor(0, 0, 0, 1.0).clear()

    const loop = () => {
        
        camera.updateViewMatrix()
        glExtend.clear()

        directionalShadowShader.activateShader()
            .updateGPU(lightView.viewMatrix, ShaderProgramMatrixFields.CAMERA_MATRIX)
        
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