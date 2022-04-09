
import { Matrix, Vec2 } from '../geom'

export function screenPosToSvgElementSpace(element:Element, pos:Vec2):Vec2 {

    return getSvgElementTransform(element).invert().transformVec2(pos)

}

export function getSvgElementTransform(element:Element):Matrix {

    var matrix = Matrix.identity()

    if(element.getAttribute !== undefined) {

        var transform = element.getAttribute('transform')

        if(transform) {
            matrix = Matrix.fromSVGString(transform)
        }
    }

    if(element.parentNode)
        matrix = getSvgElementTransform(element.parentNode as Element).multiply(matrix)
    
    return matrix
}

