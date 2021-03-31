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


    // Returns an identity matrix. You can optionally pass an existing 
    // matrix in result to avoid allocating a new matrix. 
    // This emulates the OpenGL function glLoadIdentity().
    identity (transform?: Transformation) {
        transform = transform ?? new Transformation();
        let m = transform.matrix;
        m[0] = m[5] = m[10] = m[15] = 1;
        m[1] = m[2] = m[3] = m[4] = m[6] = m[7] = m[8] = m[9] = m[11] = m[12] = m[13] = m[14] = 0;
        return transform;
    };

    // Multiply by translation matrix
    translate(x: number, y: number, z: number) {
        const transform = new Transformation();
        transform.matrix[3] = x;
        transform.matrix[7] = y;
        transform.matrix[11] = z;
        return transform;
    }

    // Multiply by scaling matrix
    scale(x: number, y: number, z: number) {
        const transform = new Transformation();
        transform.matrix[0] = x;
        transform.matrix[5] = y;
        transform.matrix[10] = z;
        return transform;
    }

    // Returns a matrix that rotates by a degrees around the vector x, y, z. 
    // You can optionally pass an existing matrix in result to avoid allocating a new matrix. 
    // This emulates the OpenGL function glRotate().
    rotate (angle: number, x: number, y: number, z: number, transform: Transformation) {
        if (!angle || (!x && !y && !z)) {
          return this.identity(transform);
        }
      
        transform = transform ?? new Transformation();
        let m = transform.matrix;
      
        let d = Math.sqrt(x*x + y*y + z*z);
        angle *= Math.PI / 180; x /= d; y /= d; z /= d;
        let c = Math.cos(angle), s = Math.sin(angle), t = 1 - c;
      
        m[0] = x * x * t + c;
        m[1] = x * y * t - z * s;
        m[2] = x * z * t + y * s;
        m[3] = 0;
      
        m[4] = y * x * t + z * s;
        m[5] = y * y * t + c;
        m[6] = y * z * t - x * s;
        m[7] = 0;
      
        m[8] = z * x * t - y * s;
        m[9] = z * y * t + x * s;
        m[10] = z * z * t + c;
        m[11] = 0;
      
        m[12] = 0;
        m[13] = 0;
        m[14] = 0;
        m[15] = 1;
      
        return transform;
    };

    // Returns the concatenation of the transforms for left and right. 
    // You can optionally pass an existing matrix in result to avoid 
    // allocating a new matrix. This emulates the OpenGL function glMultMatrix().
    multiply (right: Transformation, transform?: Transformation) {
        transform = transform ?? new Transformation();
        let a = this.matrix, b = right.matrix, r = transform.matrix;
      
        r[0] = a[0] * b[0] + a[1] * b[4] + a[2] * b[8] + a[3] * b[12];
        r[1] = a[0] * b[1] + a[1] * b[5] + a[2] * b[9] + a[3] * b[13];
        r[2] = a[0] * b[2] + a[1] * b[6] + a[2] * b[10] + a[3] * b[14];
        r[3] = a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + a[3] * b[15];
      
        r[4] = a[4] * b[0] + a[5] * b[4] + a[6] * b[8] + a[7] * b[12];
        r[5] = a[4] * b[1] + a[5] * b[5] + a[6] * b[9] + a[7] * b[13];
        r[6] = a[4] * b[2] + a[5] * b[6] + a[6] * b[10] + a[7] * b[14];
        r[7] = a[4] * b[3] + a[5] * b[7] + a[6] * b[11] + a[7] * b[15];
      
        r[8] = a[8] * b[0] + a[9] * b[4] + a[10] * b[8] + a[11] * b[12];
        r[9] = a[8] * b[1] + a[9] * b[5] + a[10] * b[9] + a[11] * b[13];
        r[10] = a[8] * b[2] + a[9] * b[6] + a[10] * b[10] + a[11] * b[14];
        r[11] = a[8] * b[3] + a[9] * b[7] + a[10] * b[11] + a[11] * b[15];
      
        r[12] = a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + a[15] * b[12];
        r[13] = a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + a[15] * b[13];
        r[14] = a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + a[15] * b[14];
        r[15] = a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + a[15] * b[15];
      
        return transform;
    };

    static inverse(matrix: number[], transform?: Transformation) {
        transform = transform ?? new Transformation();
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
        transform = transform ?? new Transformation();
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
        transform = transform ?? new Transformation();
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