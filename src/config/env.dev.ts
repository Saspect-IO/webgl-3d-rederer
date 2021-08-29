import texture0 from '@/assets/resources/formula_1/textures/formula_1.png';
import texture1 from '@/assets/resources/formula_1/textures/formula1_DefaultMaterial_Specular.png';
import texture2 from '@/assets/resources/formula_1/textures/formula1_DefaultMaterial_Glossiness.png';
import texture3 from '@/assets/resources/formula_1/textures/formula1_DefaultMaterial_Height.png';
import vertices from '@/assets/resources/formula_1/source/formula_1.obj';

export default {
    MODELS:{
        FORMULA_1:{
            TEXTURES:[ texture0, texture1, texture2, texture3 ],
            MODEL: vertices
        }
    }
}