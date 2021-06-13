import { ProgramEntrySettings, ShaderMatrixTypes } from '@/modules'
import GLExtend from './core/glContext'
import {Camera, CameraController }  from './core/camera'
import { GridAxis, GridAxisShader } from './core/primitives/grid/grid'
import { Model, ModelShader } from './core/models/model'
import Light from './core/light'


(async () => {
    const glExtend = new GLExtend(ProgramEntrySettings.WEBGL_CANVAS_ID)
    glExtend.fitScreen(0.95, 0.90).setClearColor(0, 0, 0, 1.0).clear()
    const gl = glExtend.getContext() as WebGLRenderingContext

    const camera = new Camera(gl as WebGLRenderingContext)
    camera.transform.position.set(0, 1, 3)
    new CameraController(gl as WebGLRenderingContext, camera)

    const gridAxisShader = new GridAxisShader(gl as WebGLRenderingContext, camera.projection)
    const gridAxis = GridAxis.createGeometry(gl, false)

    const modelShader = new ModelShader(gl as WebGLRenderingContext, camera.projection)
    const model = await Model.createGeometry(gl, modelShader, ProgramEntrySettings.PATH_ASSETS_OBJ, ProgramEntrySettings.PATH_ASSETS_TEXTURE)
    model.setScale(0.15,0.15,0.15)

    const light = new Light()

    const loop = () => {
        
        camera.updateViewMatrix()
        glExtend.clear()
        
        gridAxisShader.activateShader()
            .updateGPU(camera.viewMatrix, ShaderMatrixTypes.CAMERA_MATRIX)
            .renderModel(gridAxis.preRender())

        modelShader.activateShader()
            .updateGPU(camera.viewMatrix, ShaderMatrixTypes.CAMERA_MATRIX)
            .renderModel(model.preRender())
            
        light.useLight(modelShader)

        requestAnimationFrame(loop)
    }
    loop()
})()