export default class Transformation {
    
    constructor() {
        this.matrix = [
            1, 0, 0, 0, 
            0, 1, 0, 0, 
            0, 0, 1, 0, 
            0, 0, 0, 1
        ];
    }

    matrix: Array<number>;

    // Multiply matrices, to chain transformations
    mult(t: Transformation) {
        const transform = new Transformation();
        for (var row = 0; row < 4; ++row) {
            for (var col = 0; col < 4; ++col) {
                var sum = 0
                for (var k = 0; k < 4; ++k) {
                    sum += this.matrix[k * 4 + row] * t.matrix[col * 4 + k]
                }
                transform[col * 4 + row] = sum
            }
        }
        return transform;
    }

    // Multiply by translation matrix
    translate(x:number, y:number, z:number) {
        const transform = new Transformation();
        transform.matrix[12] = x;
        transform.matrix[13] = y;
        transform.matrix[14] = z;
        return this.mult(transform);
    }

    // Multiply by scaling matrix
    scale(x:number, y:number, z:number) {
        const transform = new Transformation();
        transform.matrix[0] = x;
        transform.matrix[5] = y;
        transform.matrix[10] = z;
        return this.mult(transform);
    }

    // Multiply by rotation matrix around X axis
    rotateX(angle:number) {
        const transform = new Transformation();
        const cos = Math.cos(angle)
        const sin = Math.sin(angle)
        transform.matrix[5] = cos
        transform.matrix[10] = cos
        transform.matrix[9] = -sin
        transform.matrix[6] = sin
        return this.mult(transform);
    }

    // Multiply by rotation matrix around Y axis
    rotateY(angle:number) {
        const transform = new Transformation();
        const cos = Math.cos(angle)
        const sin = Math.sin(angle)
        transform.matrix[0] = cos;
        transform.matrix[10] = cos;
        transform.matrix[2] = -sin;
        transform.matrix[8] = sin;
        return this.mult(transform);
    }

    // Multiply by rotation matrix around Z axis
    rotateZ(angle:number) {
        const transform = new Transformation();
        const cos = Math.cos(angle)
        const sin = Math.sin(angle)
        transform.matrix[0] = cos;
        transform.matrix[5] = cos;
        transform.matrix[4] = -sin;
        transform.matrix[1] = sin;
        return this.mult(transform);
    }

    sendToGpu(gl:WebGLRenderingContext, uniform, transpose = false) {
        gl.uniformMatrix4fv(uniform, transpose, new Float32Array(this.matrix))
    }
}