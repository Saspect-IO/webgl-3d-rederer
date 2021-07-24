import { ProgramEntrySettings } from '@/modules'
import GLContext from './core/glContext'
import { Camera, CameraController }  from './core/camera'
import { Model, ModelShader } from './core/model'
import { DirectionalShadow, DirectionalShadowShader } from './core/shadows/directional'
import Light from './core/light'
import DepthTexture from './core/Textures/depthTexture'
import { Vector3 } from './core/math'
import { GridAxis, GridAxisShader } from './core/primitives/grid/grid'


(async()=>{
    const glContext = new GLContext(ProgramEntrySettings.WEBGL_CANVAS_ID)
    glContext.fitScreen(0.95, 0.90).setClearColor(13, 17, 23, 1.0).clear()
    const gl = glContext.getContext() as WebGLRenderingContext

    const lightPosition = new Vector3(1.5, 2.5, 3)
    const light = new Light(lightPosition)
    const lightView = new Camera(gl as WebGLRenderingContext)
    lightView.transform.position.set(lightPosition.x, lightPosition.y, lightPosition.z)

    const directionalShadowShader = new DirectionalShadowShader(gl as WebGLRenderingContext, lightView)
    const directionalShadow = await DirectionalShadow.createGeometry(gl, directionalShadowShader, ProgramEntrySettings.PATH_ASSETS_OBJ)
    
    const camera = new Camera(gl as WebGLRenderingContext)
    camera.transform.position.set(0, 1, 3)
    new CameraController(gl as WebGLRenderingContext, camera)

    const gridAxisShader = new GridAxisShader(gl as WebGLRenderingContext, camera)
    const gridAxis = GridAxis.createGeometry(gl, gridAxisShader, false)

    const modelShader = new ModelShader(gl as WebGLRenderingContext, camera, lightView)
    const model = await Model.createGeometry(gl, modelShader, ProgramEntrySettings.PATH_ASSETS_OBJ, ProgramEntrySettings.PATH_ASSETS_TEXTURE)
    model.setScale(0.0035,0.0035,0.0035)

    const loop = () => {
        
        glContext.depthRender(directionalShadow.mesh.depth as DepthTexture)

        lightView.updateViewMatrix()
        directionalShadowShader.setUniforms(gl, directionalShadow.preRender()).shaderProgram
            .renderModel(directionalShadow.preRender() )
    
        glContext.clearFramebuffer().fitScreen(0.95, 0.90).clear()

        camera.updateViewMatrix()

        gridAxisShader.setUniforms(gl, gridAxis.preRender()).shaderProgram
            .renderModel(gridAxis.preRender())

        modelShader.setUniforms(gl, model.preRender())
            .shaderProgram.renderModel(model.preRender())

        light.setUniforms(gl, modelShader, camera)

        requestAnimationFrame(loop)
    }
    loop()
})()