const githubPagesRoot = '/webgl-3d-renderer'
const texture0 = `${githubPagesRoot}/assets/resources/formula_1/textures/formula_1.png`;
const texture1 = `${githubPagesRoot}/assets/resources/formula_1/textures/formula1_DefaultMaterial_Specular.png`;
const texture2 = `${githubPagesRoot}/assets/resources/formula_1/textures/formula1_DefaultMaterial_Glossiness.png`;
const texture3 = `${githubPagesRoot}/assets/resources/formula_1/textures/formula1_DefaultMaterial_Height.png`;
const vertices = `${githubPagesRoot}/assets/resources/formula_1/source/formula_1.obj`;

export default {
    MODELS:{
        FORMULA_1:{
            TEXTURES:[ texture0, texture1, texture2, texture3 ],
            MODEL: vertices
        }
    }
}