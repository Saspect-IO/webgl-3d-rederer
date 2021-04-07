import GLContext from './core/GLContext';
import {Camera, CameraController }  from './core/camera';
import { GridAxisShader, ModelShader } from './core/shaderExtend';
import { GridAxis } from './core/primitives';
import Light  from './core/light';
import Model from './core/model';
import { ProgramEntrySettings } from './modules';

(async () => {
    const glContext = new GLContext(ProgramEntrySettings.WEBGL_CANVAS_ID);
    glContext.fitScreen(0.95, 0.90).setClearColor(255, 255, 255, 1.0).clear();
    const gl = glContext.getContext() as WebGLRenderingContext;

    const camera = new Camera(gl as WebGLRenderingContext);
    camera.transform.position.set(0, 1, 3);
    const cemeraController = new CameraController(gl as WebGLRenderingContext, camera);

    const gridAxisShader = new GridAxisShader(gl as WebGLRenderingContext, camera.projection);
    const gridAxis = GridAxis.createModel(gl, gridAxisShader, false);

    const modelShader = new ModelShader(gl as WebGLRenderingContext, camera.projection);
    //const model = await Model.createModel(gl, modelShader, ProgramEntrySettings.PATH_ASSETS_SPHERE, ProgramEntrySettings.PATH_ASSETS_DIFFUSE);

    const loop = () => {
        
        camera.updateViewMatrix();
        glContext.clear();

        gridAxisShader.activate()
            .setCameraMatrix(camera.viewMatrix)
            .renderModel(gridAxis.preRender());

        // modelShader.activate()
        //     .setCameraMatrix(camera.viewMatrix)
        //     .renderModel(model.preRender());

        requestAnimationFrame(loop);
    }
    loop();
})()