
import Vec2 from './Vec2'
import Rect from './Rect'

export default class Matrix {

    elements: Array<number>

    constructor(arr?:Array<number>) {
        this.elements = arr || [
            1, 0, 0,
            0, 1, 0
        ]
    }

    static identity():Matrix {
        return new Matrix()
    }

    static translation(vector): Matrix {
        return new Matrix([
            1, 0, vector.x,
            0, 1, vector.y
        ])
    }

    static rotation(angle:number, origin:Vec2): Matrix {

        angle = angle * (Math.PI / 180.0)

        const rotation:Matrix = new Matrix([
            Math.cos(angle), Math.sin(angle), 0,
            -Math.sin(angle), Math.cos(angle), 0
        ])

        if(origin !== undefined) {

            return Matrix.translation(origin)
                    .multiply(rotation).multiply(
                        Matrix.translation(origin.multiplyScalar(-1)))

        } else {

            return rotation

        }
    }

    translate(vector:Vec2): Matrix {
        return this.multiply(Matrix.translation(vector))
    }

    rotate(angle:number, origin:Vec2): Matrix {
        return this.multiply(Matrix.rotation(angle, origin))
    }

    multiply(rhs:Matrix) {

        const a: Array<number> = this.elements
        const b: Array<number> = rhs.elements

        return new Matrix([
            a[0] * b[0] + a[1] * b[3],
            a[0] * b[1] + a[1] * b[4],
            a[0] * b[2] + a[1] * b[5] + a[2],
            a[3] * b[0] + a[4] * b[3],
            a[3] * b[1] + a[4] * b[4],
            a[3] * b[2] + a[4] * b[5] + a[5]
        ])

    }

    transformVec2(vector:Vec2): Vec2 {

        return new Vec2((this.elements[0] * vector.x) + (this.elements[1] * vector.y) + this.elements[2],
                        (this.elements[3] * vector.x) + (this.elements[4] * vector.y) + this.elements[5])

    }

    transformRect(rect:Rect): Rect {

        return new Rect(
            this.transformVec2(rect.topLeft),
            this.transformVec2(rect.bottomRight)
        )

    }

    toSVGString(): string {

        return 'matrix(' + [
            this.elements[0], this.elements[3],
            this.elements[1], this.elements[4],
            this.elements[2], this.elements[5],
        ].join(',') + ')'
    }

    static fromSVGString(str: string): Matrix {

        const tokens:Array<string> = str.split('matrix(')[1].split(')')[0].split(',')

        return new Matrix([
            parseFloat(tokens[0]), parseFloat(tokens[2]),
            parseFloat(tokens[4]), parseFloat(tokens[1]),
            parseFloat(tokens[3]), parseFloat(tokens[5])
        ])
    }

    determinant(): number {

        return (this.elements[0] * this.elements[4]) - (this.elements[1] - this.elements[3])

    }

    invert(): Matrix {

        const d:number = 1.0 / this.determinant()
        
        return new Matrix([
            this.elements[4] * d,
            (- this.elements[1]) * d,
            (this.elements[1] * this.elements[5] - this.elements[2] * this.elements[4]) * d,
            (- this.elements[3]) * d,
            this.elements[0] * d,
            (this.elements[2] * this.elements[3] - this.elements[0] * this.elements[5]) * d,
        ])
    }

    scale(scaleFactor:Vec2): Matrix {

        return this.multiply(new Matrix([
            scaleFactor.x, 0, 0,
            0, scaleFactor.y, 0
        ]))

    }

    getScaleVector() {

        return Vec2.fromXY(this.elements[0], this.elements[4])

    }

}


