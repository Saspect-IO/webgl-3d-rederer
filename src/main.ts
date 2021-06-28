import { ProgramEntrySettings } from '@/modules'
import GLContext from './core/glContext'
import { Camera, CameraController }  from './core/camera'
import { GridAxis, GridAxisShader } from './core/primitives/grid/grid'
import { Model, ModelShader } from './core/model'
import { DirectionalShadow, DirectionalShadowShader } from './core/shadows/directional'
import Light from './core/light'
import DepthTexture from './core/Textures/depthTexture'
import { FloorQuad, FloorQuadShader } from './core/primitives/grid/floorQuad'
import { Vector3 } from './core/math'


(async () => {
    const glContext = new GLContext(ProgramEntrySettings.WEBGL_CANVAS_ID)
    glContext.fitScreen(0.95, 0.90).setClearColor(20, 21, 24, 1.0).clear()
    const gl = glContext.getContext() as WebGLRenderingContext

    const lightPosition = new Vector3(3, 2, 3)
    const light = new Light(lightPosition)
    const lightViewCamera = new Camera(gl as WebGLRenderingContext)
    lightViewCamera.transform.position.set(lightPosition.x, lightPosition.y, lightPosition.z)

    const directionalShadowShader = new DirectionalShadowShader(gl as WebGLRenderingContext, lightViewCamera)
    const directionalShadow = await DirectionalShadow.createGeometry(gl, directionalShadowShader, ProgramEntrySettings.PATH_ASSETS_OBJ)
    
    const camera = new Camera(gl as WebGLRenderingContext)
    camera.transform.position.set(0, 1, 3)
    new CameraController(gl as WebGLRenderingContext, camera)

    const gridAxisShader = new GridAxisShader(gl as WebGLRenderingContext, camera)
    const gridAxis = GridAxis.createGeometry(gl, gridAxisShader, false)

    // const floorQuadShader = new FloorQuadShader(gl as WebGLRenderingContext, camera, lightViewCamera)
    // const floorQuad = await FloorQuad.createGeometry(gl, floorQuadShader)

    const modelShader = new ModelShader(gl as WebGLRenderingContext, camera, lightViewCamera)
    const model = await Model.createGeometry(gl, modelShader, ProgramEntrySettings.PATH_ASSETS_OBJ, ProgramEntrySettings.PATH_ASSETS_TEXTURE)
    model.setScale(0.15,0.15,0.15)

  

    const loop = () => {
        
        glContext.depthRender(directionalShadow.mesh.depth as DepthTexture)
        lightViewCamera.updateViewMatrix()

        directionalShadowShader.setUniforms(gl, directionalShadow.preRender()).shaderProgram
            .renderModel(directionalShadow.preRender() )
    
        glContext.clearFramebuffer().fitScreen(0.95, 0.90).clear()

        camera.updateViewMatrix()
        gridAxisShader.setUniforms(gl, gridAxis.preRender()).shaderProgram
            .renderModel(gridAxis.preRender())

        // floorQuadShader.setUniforms(gl, floorQuad.preRender()).shaderProgram
        //     .renderModel(floorQuad.preRender())

        modelShader.setUniforms(gl, model.preRender()).shaderProgram
            .renderModel(model.preRender())

        light.setUniforms(gl, modelShader, camera)

        requestAnimationFrame(loop)
    }
    loop()
})()