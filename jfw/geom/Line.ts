
import Vec2 from './Vec2'
import almostEqual from './almostEqual'
import closedSegmentIntersect from './closedSegmentIntersect'

export default class Line {

    a: Vec2
    b: Vec2

    constructor(a: Vec2, b: Vec2) {
        this.a = a
        this.b = b
    }

    closestPoint(point:Vec2): Vec2 {

        var aToPoint:Vec2 = point.subtract(this.a)
        var aToB:Vec2 = this.b.subtract(this.a)

        var aToBSquared:number = aToB.magnitudeSquared()

        var scalarProduct:number = aToPoint.scalarProduct(aToB)

        var distanceNormal:number = scalarProduct / aToBSquared

        var p:Vec2 = this.a.add(aToB.multiplyScalar(distanceNormal))

        p = p.min(this.b)
        p = p.max(this.a)

        return p
    }


    intersectsLine(lineB:Line): boolean {

        return closedSegmentIntersect(this.a, this.b,
                                      lineB.a, lineB.b)
    }

    getLength(): number {
        return this.b.subtract(this.a).magnitude()
    }

    getDirectionVector(): Vec2 {
        return this.b.subtract(this.a).normalise()
    }

    adjustEnd(delta:number):Line {

        let len = this.getLength()
        let dir = this.getDirectionVector()

        let newVec = dir.multiplyScalar(len + delta)

        return new Line(this.a, this.a.add(newVec))
    }

    adjustStart(delta:number):Line {

        let len = this.getLength()
        let dir = this.getDirectionVector()

        let newVec = dir.multiplyScalar(len + delta)

        return new Line(this.b.subtract(newVec), this.a)
    }
}







