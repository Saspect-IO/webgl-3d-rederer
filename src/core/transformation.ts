export default class Transformation {

    constructor() {
        // identity matrix
        this.matrix = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
    }

    matrix: Array < number > ;

    // Multiply matrices, to chain transformations
    mult(t: Transformation) {
        const transform = new Transformation();
        for (var row = 0; row < 4; ++row) {
            for (var col = 0; col < 4; ++col) {
                var sum = 0;
                for (var k = 0; k < 4; ++k) {
                    sum += this.matrix[k * 4 + row] * t.matrix[col * 4 + k];
                }
                transform.matrix[col * 4 + row] = sum;
            }
        }
        return transform;
    }

    // Multiply by translation matrix
    translate(x: number, y: number, z: number) {
        const transform = new Transformation();
        transform.matrix[12] = x;
        transform.matrix[13] = y;
        transform.matrix[14] = z;
        return this.mult(transform);
    }

    // Multiply by scaling matrix
    scale(x: number, y: number, z: number) {
        const transform = new Transformation();
        transform.matrix[0] = x;
        transform.matrix[5] = y;
        transform.matrix[10] = z;
        const scale = this.mult(transform);
        return scale;
    }

    // Multiply by rotation matrix around X axis
    rotateX(angle: number) {
        const transform = new Transformation();
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        transform.matrix[5] = cos;
        transform.matrix[10] = cos;
        transform.matrix[9] = -sin;
        transform.matrix[6] = sin;
        return this.mult(transform);
    }

    // Multiply by rotation matrix around Y axis
    rotateY(angle: number) {
        const transform = new Transformation();
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        transform.matrix[0] = cos;
        transform.matrix[10] = cos;
        transform.matrix[2] = -sin;
        transform.matrix[8] = sin;
        return this.mult(transform);
    }

    // Multiply by rotation matrix around Z axis
    rotateZ(angle: number) {
        const transform = new Transformation();
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        transform.matrix[0] = cos;
        transform.matrix[5] = cos;
        transform.matrix[4] = -sin;
        transform.matrix[1] = sin;
        return this.mult(transform);
    }

    static inverse(matrix: number[], transform?: Transformation) {
        transform = transform || new Transformation();
        let m = matrix;
        let r = transform.matrix;

        r[0] = m[5] * m[10] * m[15] - m[5] * m[14] * m[11] - m[6] * m[9] * m[15] + m[6] * m[13] * m[11] + m[7] * m[9] * m[14] - m[7] * m[13] * m[10];
        r[1] = -m[1] * m[10] * m[15] + m[1] * m[14] * m[11] + m[2] * m[9] * m[15] - m[2] * m[13] * m[11] - m[3] * m[9] * m[14] + m[3] * m[13] * m[10];
        r[2] = m[1] * m[6] * m[15] - m[1] * m[14] * m[7] - m[2] * m[5] * m[15] + m[2] * m[13] * m[7] + m[3] * m[5] * m[14] - m[3] * m[13] * m[6];
        r[3] = -m[1] * m[6] * m[11] + m[1] * m[10] * m[7] + m[2] * m[5] * m[11] - m[2] * m[9] * m[7] - m[3] * m[5] * m[10] + m[3] * m[9] * m[6];

        r[4] = -m[4] * m[10] * m[15] + m[4] * m[14] * m[11] + m[6] * m[8] * m[15] - m[6] * m[12] * m[11] - m[7] * m[8] * m[14] + m[7] * m[12] * m[10];
        r[5] = m[0] * m[10] * m[15] - m[0] * m[14] * m[11] - m[2] * m[8] * m[15] + m[2] * m[12] * m[11] + m[3] * m[8] * m[14] - m[3] * m[12] * m[10];
        r[6] = -m[0] * m[6] * m[15] + m[0] * m[14] * m[7] + m[2] * m[4] * m[15] - m[2] * m[12] * m[7] - m[3] * m[4] * m[14] + m[3] * m[12] * m[6];
        r[7] = m[0] * m[6] * m[11] - m[0] * m[10] * m[7] - m[2] * m[4] * m[11] + m[2] * m[8] * m[7] + m[3] * m[4] * m[10] - m[3] * m[8] * m[6];

        r[8] = m[4] * m[9] * m[15] - m[4] * m[13] * m[11] - m[5] * m[8] * m[15] + m[5] * m[12] * m[11] + m[7] * m[8] * m[13] - m[7] * m[12] * m[9];
        r[9] = -m[0] * m[9] * m[15] + m[0] * m[13] * m[11] + m[1] * m[8] * m[15] - m[1] * m[12] * m[11] - m[3] * m[8] * m[13] + m[3] * m[12] * m[9];
        r[10] = m[0] * m[5] * m[15] - m[0] * m[13] * m[7] - m[1] * m[4] * m[15] + m[1] * m[12] * m[7] + m[3] * m[4] * m[13] - m[3] * m[12] * m[5];
        r[11] = -m[0] * m[5] * m[11] + m[0] * m[9] * m[7] + m[1] * m[4] * m[11] - m[1] * m[8] * m[7] - m[3] * m[4] * m[9] + m[3] * m[8] * m[5];

        r[12] = -m[4] * m[9] * m[14] + m[4] * m[13] * m[10] + m[5] * m[8] * m[14] - m[5] * m[12] * m[10] - m[6] * m[8] * m[13] + m[6] * m[12] * m[9];
        r[13] = m[0] * m[9] * m[14] - m[0] * m[13] * m[10] - m[1] * m[8] * m[14] + m[1] * m[12] * m[10] + m[2] * m[8] * m[13] - m[2] * m[12] * m[9];
        r[14] = -m[0] * m[5] * m[14] + m[0] * m[13] * m[6] + m[1] * m[4] * m[14] - m[1] * m[12] * m[6] - m[2] * m[4] * m[13] + m[2] * m[12] * m[5];
        r[15] = m[0] * m[5] * m[10] - m[0] * m[9] * m[6] - m[1] * m[4] * m[10] + m[1] * m[8] * m[6] + m[2] * m[4] * m[9] - m[2] * m[8] * m[5];

        let det = m[0] * r[0] + m[1] * r[4] + m[2] * r[8] + m[3] * r[12];
        for (let i = 0; i < 16; i++) r[i] /= det;

        return transform;
    };

    static transpose(matrix: number[], transform?: Transformation) {
        transform = transform || new Transformation();
        let m = matrix;
        let r = transform.matrix;
        r[0] = m[0];
        r[1] = m[4];
        r[2] = m[8];
        r[3] = m[12];
        r[4] = m[1];
        r[5] = m[5];
        r[6] = m[9];
        r[7] = m[13];
        r[8] = m[2];
        r[9] = m[6];
        r[10] = m[10];
        r[11] = m[14];
        r[12] = m[3];
        r[13] = m[7];
        r[14] = m[11];
        r[15] = m[15];

        return transform;
    };


    static frustum (l: number, r: number, b: number, t: number, n: number, f: number, transform: Transformation) {
        transform = transform || new Transformation();
        let m = transform.matrix;
      
        m[0] = 2 * n / (r - l);
        m[1] = 0;
        m[2] = (r + l) / (r - l);
        m[3] = 0;
      
        m[4] = 0;
        m[5] = 2 * n / (t - b);
        m[6] = (t + b) / (t - b);
        m[7] = 0;
      
        m[8] = 0;
        m[9] = 0;
        m[10] = -(f + n) / (f - n);
        m[11] = -2 * f * n / (f - n);
      
        m[12] = 0;
        m[13] = 0;
        m[14] = -1;
        m[15] = 0;
      
        return transform;
    };

    sendToGpu(glContext: WebGLRenderingContext, uniform: WebGLUniformLocation, transpose = false) {
        glContext.uniformMatrix4fv(uniform, transpose, new Float32Array(this.matrix));
    }
}