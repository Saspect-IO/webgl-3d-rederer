const texture0 = '/webgl-3d-renderer/assets/resources/formula_1/textures/formula_1.png';
const texture1 = '/webgl-3d-renderer/assets/resources/formula_1/textures/formula1_DefaultMaterial_Specular.png';
const texture2 = '/webgl-3d-renderer/assets/resources/formula_1/textures/formula1_DefaultMaterial_Glossiness.png';
const texture3 = '/webgl-3d-renderer/assets/resources/formula_1/textures/formula1_DefaultMaterial_Height.png';
const vertices = '/webgl-3d-renderer/assets/resources/formula_1/source/formula_1.obj';

export default {
    MODELS:{
        FORMULA_1:{
            TEXTURES:[ texture0, texture1, texture2, texture3 ],
            MODEL: vertices
        }
    }
}