import GLExtend from './core/glContext';
import {Camera, CameraController }  from './core/camera';
import { GridAxisShader, ModelShader } from './core/shaderExtend';
import { GridAxis } from './core/primitives';
import Light  from './core/light';
import Model from './core/model';
import { ProgramEntrySettings } from '@/modules';


(async () => {
    const glExtend = new GLExtend(ProgramEntrySettings.WEBGL_CANVAS_ID);
    glExtend.fitScreen(0.95, 0.90).setClearColor(0, 0, 0, 1.0).clear();
    const gl = glExtend.getContext() as WebGLRenderingContext;

    const camera = new Camera(gl as WebGLRenderingContext);
    camera.transform.position.set(0, 1, 3);
    const cemeraController = new CameraController(gl as WebGLRenderingContext, camera);

    const gridAxisShader = new GridAxisShader(gl as WebGLRenderingContext, camera.projection);
    const gridAxis = GridAxis.createGeometry(gl, gridAxisShader, false);

    const modelShader = new ModelShader(gl as WebGLRenderingContext, camera.projection);
    const model = await Model.createGeometry(gl, modelShader, ProgramEntrySettings.PATH_ASSETS_OBJ, ProgramEntrySettings.PATH_ASSETS_TEXTURE);
    model.setScale(0.15,0.15,0.15);

    const loop = () => {
        
        camera.updateViewMatrix();
        glExtend.clear();

        gridAxisShader.activateShader()
            .setCameraMatrix(camera.viewMatrix)
            .renderModel(gridAxis.preRender());

        modelShader.activateShader()
            .setCameraMatrix(camera.viewMatrix)
            .renderModel(model.preRender());

        requestAnimationFrame(loop);
    }
    loop();
})()