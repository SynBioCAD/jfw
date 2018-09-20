
import Vec2 from './Vec2'
import Line from './Line'
import Insets from './Insets'

export default class Rect
{
    topLeft: Vec2
    bottomRight: Vec2

    constructor(topLeft?:Vec2, bottomRight?:Vec2) {

        this.topLeft = topLeft || new Vec2(0, 0)
        this.bottomRight = bottomRight || new Vec2(0, 0)
    }

    static fromClientRect(cR:ClientRect) {

        return new Rect(
            Vec2.fromXY(cR.left, cR.top),
            Vec2.fromXY(cR.right, cR.bottom)
        )

    }

    static fromSvgBBox(bbox:any) {

        return new Rect(
            Vec2.fromXY(bbox.x, bbox.y),
            Vec2.fromXY(bbox.x + bbox.width, bbox.y + bbox.height)
        )

    }

    width(): number {
        return this.bottomRight.x - this.topLeft.x
    }

    height(): number {
        return this.bottomRight.y - this.topLeft.y
    }

    size(): Vec2 {
        return this.bottomRight.subtract(this.topLeft).abs()
    }

    clone(): Rect {
        return new Rect(this.topLeft, this.bottomRight)
    }

    area(): number {
        return this.width() * this.height()
    }

    expand(amount:number): Rect {

        return new Rect(
            this.topLeft.subtractScalar(amount),
            this.bottomRight.addScalar(amount)
        )

    }

    contract(amount:number): Rect {

        return new Rect(
            this.topLeft.addScalar(amount),
            this.bottomRight.subtractScalar(amount)
        )

    }

    trimLeft(amount:number): Rect {

        return new Rect(
            Vec2.fromXY(this.topLeft.x + amount, this.topLeft.y),
            this.bottomRight
        )

    }

    trimTop(amount:number): Rect {

        return new Rect(
            Vec2.fromXY(this.topLeft.x, this.topLeft.y + amount),
            this.bottomRight
        )

    }

    trimRight(amount:number): Rect {

        return new Rect(
            this.topLeft,
            Vec2.fromXY(this.bottomRight.x - amount, this.bottomRight.y)
        )

    }

    trimBottom(amount:number): Rect {

        return new Rect(
            this.topLeft,
            Vec2.fromXY(this.bottomRight.x, this.bottomRight.y - amount)
        )

    }

    move(delta:Vec2): Rect {
        return new Rect(
            this.topLeft.add(delta),
            this.bottomRight.add(delta)
        )
    }

    moveTo(pos:Vec2): Rect {
        return new Rect(
            pos,
            pos.add(this.size())
        )
    }

    center(): Vec2 {
        return this.topLeft.add(this.size().multiplyScalar(0.5))
    }

    intersects(rectB:Rect): boolean {

        return rectB.bottomRight.y > this.topLeft.y &&
                 rectB.topLeft.y < this.bottomRight.y &&
                 rectB.bottomRight.x > this.topLeft.x &&
                 rectB.topLeft.x < this.bottomRight.x
    }

    intersectsPoint(point:Vec2): boolean {
        
        return point.x > this.topLeft.x &&
                point.x < this.bottomRight.x &&
                point.y > this.topLeft.y &&
                point.y < this.bottomRight.y

    }

    contains(rectB:Rect): boolean {

        return rectB.topLeft.x >= this.topLeft.x &&
               rectB.topLeft.y >= this.topLeft.y &&
               rectB.bottomRight.x <= this.bottomRight.x &&
               rectB.bottomRight.y <= this.bottomRight.y
    }

    inset(insets:Insets): Rect {

        const size = this.size()

        return new Rect(
            Vec2.fromXY(this.topLeft.x + size.x * insets.left, this.topLeft.y + size.y * insets.top),
            Vec2.fromXY(this.bottomRight.x - size.x * insets.right, this.bottomRight.y - size.y * insets.bottom)
        )

    }

    normalize(): Rect {

        const size = this.size()

        const topLeft = this.topLeft.min(this.bottomRight)
        const bottomRight = topLeft.add(size)

        return new Rect(topLeft, bottomRight)
    }

    surround(rectB:Rect): Rect {

        return new Rect(
            this.topLeft.min(rectB.topLeft),
            this.bottomRight.max(rectB.bottomRight)
        )

    }

    surroundPoint(point:Vec2): Rect {

        return new Rect(
            this.topLeft.min(point),
            this.bottomRight.max(point)
        )

    }

    multiply(v:Vec2): Rect {

        return new Rect(
            this.topLeft.multiply(v),
            this.bottomRight.multiply(v),
        )

    }

    multiplyScalar(n:number): Rect {

        return new Rect(
            this.topLeft.multiplyScalar(n),
            this.bottomRight.multiplyScalar(n),
        )

    }

    toSVGPath(): string {

        return [
            'M' + Vec2.fromXY(this.topLeft.x, this.topLeft.y).toPathString(),
            'L' + Vec2.fromXY(this.bottomRight.x, this.topLeft.y).toPathString(),
            'L' + Vec2.fromXY(this.bottomRight.x, this.bottomRight.y).toPathString(),
            'L' + Vec2.fromXY(this.topLeft.x, this.bottomRight.y).toPathString(),
            'Z'
        ].join('')
    }

    top():Line {

        return new Line(Vec2.fromXY(this.topLeft.x, this.topLeft.y),
                        Vec2.fromXY(this.bottomRight.x, this.topLeft.y))

    }

    left():Line {

        return new Line(Vec2.fromXY(this.topLeft.x, this.topLeft.y),
                        Vec2.fromXY(this.topLeft.x, this.bottomRight.y))

    }

    bottom():Line {

        return new Line(Vec2.fromXY(this.topLeft.x, this.bottomRight.y),
                        Vec2.fromXY(this.bottomRight.x, this.bottomRight.y))

    }

    right():Line {

        return new Line(Vec2.fromXY(this.bottomRight.x, this.topLeft.y),
                        Vec2.fromXY(this.bottomRight.x, this.bottomRight.y))

    }

    closestCornerToPoint(point):Vec2 {

        const topLeft:Vec2 = this.topLeft
        const topRight:Vec2 = Vec2.fromXY(this.bottomRight.x, this.topLeft.y)
        const bottomLeft:Vec2 = Vec2.fromXY(this.topLeft.x, this.bottomRight.y)
        const bottomRight:Vec2 = this.bottomRight

        return [
            topLeft,
            topRight,
            bottomLeft,
            bottomRight
        ].sort((a, b) => a.distanceTo(point) - b.distanceTo(point))[0]
    }

    closestEdgeAndPoint(point:Vec2) {

        var leftClosest = this.left().closestPoint(point)
        var leftDistance = leftClosest.distanceTo(point)

        var rightClosest = this.right().closestPoint(point)
        var rightDistance = rightClosest.distanceTo(point)

        var topClosest = this.top().closestPoint(point)
        var topDistance = topClosest.distanceTo(point)

        var bottomClosest = this.bottom().closestPoint(point)
        var bottomDistance = bottomClosest.distanceTo(point)

        var edge = 'left'
        var distance = leftDistance
        var closest = leftClosest

        if(rightDistance < distance) {
            edge = 'right'
            distance = rightDistance
            closest = rightClosest
        }

        if(topDistance < distance) {
            edge = 'top'
            distance = topDistance
            closest = topClosest
        }

        if(bottomDistance < distance) {
            edge = 'bottom'
            distance = bottomDistance
            closest = bottomClosest
        }

        return {
            edge: edge,
            point: closest
        }
    }


    closestEdgeToPoint(point:Vec2): string {

        const distanceToLeft = Math.abs(point.x - this.topLeft.x)

        var lowestDistance = distanceToLeft
        var edge = 'left'

        const distanceToRight = Math.abs(point.x - this.bottomRight.x)

        if(distanceToRight < lowestDistance) {

            lowestDistance = distanceToRight
            edge = 'right'

        }

        const distanceToTop = Math.abs(point.y - this.topLeft.y)

        if(distanceToTop < lowestDistance) {

            lowestDistance = distanceToTop
            edge = 'top'

        }

        const distanceToBottom = Math.abs(point.y - this.bottomRight.y)

        if(distanceToBottom < lowestDistance) {

            lowestDistance = distanceToBottom
            edge = 'bottom'

        }

        return edge
    }

    edgeMidPoints() {

        const size = this.size()

        return [
            this.topLeft.add(Vec2.fromXY(0, size.y * 0.5)),
            this.topLeft.add(Vec2.fromXY(size.x * 0.5, 0)),
            this.bottomRight.subtract(Vec2.fromXY(0, size.y * 0.5)),
            this.bottomRight.subtract(Vec2.fromXY(size.x * 0.5, 0))
        ]

    }

    edgesAndMidPoints() {

        const size = this.size()

        return [
            { edge: 'left', point: this.topLeft.add(Vec2.fromXY(0, size.y * 0.5)) },
            { edge: 'top', point: this.topLeft.add(Vec2.fromXY(size.x * 0.5, 0)) },
            { edge: 'right', point: this.bottomRight.subtract(Vec2.fromXY(0, size.y * 0.5)) },
            { edge: 'bottom', point: this.bottomRight.subtract(Vec2.fromXY(size.x * 0.5, 0)) }
        ]

    }

    edgeMidPoint(edge:string):Vec2 {

        if(edge === 'top') {
            return Vec2.fromXY(this.width() / 2, this.topLeft.y)
        } else if(edge === 'bottom') {
            return Vec2.fromXY(this.width() / 2, this.bottomRight.y)
        } else if(edge === 'left') {
            return Vec2.fromXY(this.topLeft.x, this.height() / 2)
        } else if(edge === 'right') {
            return Vec2.fromXY(this.bottomRight.x, this.height() / 2)
        } else {
            throw new Error('???')
        }
    }

    closestEdgeAndMidPoint(_point:Vec2):{ point:Vec2, edge:string } {

        const midPoints = this.edgesAndMidPoints()

        const pointsAndDistances = midPoints.map((midPoint) => ({
            point: midPoint.point,
            edge: midPoint.edge,
            distance: _point.distanceTo(midPoint.point)
        }))

        const { point, edge } = pointsAndDistances.sort((a, b) => a.distance - b.distance)[0]

        return { point, edge }
    }

    closestEdgeMidPointToPoint(point:Vec2):Vec2 {

        const midPoints = this.edgeMidPoints()

        const pointsAndDistances = midPoints.map((midPoint) => ({
            point: midPoint,
            distance: point.distanceTo(midPoint)
        }))

        return pointsAndDistances.sort((a, b) => a.distance - b.distance)[0].point
    }

    closestEdgeMidPointsBetweenThisAnd(rectB) {

        const midPointsA = this.edgeMidPoints()
        const midPointsB = rectB.edgeMidPoints()

        const pointsAndDistances:any[] = []
        
        midPointsA.forEach((midPointA) => {

            midPointsB.forEach((midPointB) => {

                pointsAndDistances.push({

                    pointA: midPointA,
                    pointB: midPointB,
                    distance: midPointA.distanceTo(midPointB)

                })

            })

        })

        const closest = pointsAndDistances.sort((a, b) => a.distance - b.distance)[0]

        return {
            pointA: closest.pointA,
            pointB: closest.pointB
        }
    }

    rotate(origin:Vec2, deg:number):Rect {

        return new Rect(
            this.topLeft.rotate(origin, deg),
            this.bottomRight.rotate(origin, deg)
        )

    }

    closestPointsBetweenThisAnd(rectB:Rect) {

        const left = rectB.bottomRight.x < this.topLeft.x
        const right = rectB.topLeft.x > this.bottomRight.x
        const below = rectB.topLeft.y > this.bottomRight.y
        const above = rectB.bottomRight.y < this.topLeft.y

        if(left) {

            if(above) {

                /* left and above
                 */
                return {
                    a: this.topLeft,
                    b: rectB.bottomRight
                }

            }

            if(below) {

                /* left and below
                 */
                const bottomLeftA = Vec2.fromXY(this.topLeft.x, this.bottomRight.y)
                const topRightB = Vec2.fromXY(rectB.bottomRight.x, rectB.topLeft.y)

                return {
                    a: bottomLeftA,
                    b: topRightB
                }

            }
                
        }

        if(right) {

            if(above) {

                /* right and above
                 */
                const topRightA = Vec2.fromXY(this.bottomRight.x, this.topLeft.y)
                const bottomLeftB = Vec2.fromXY(rectB.topLeft.x, rectB.bottomRight.y)

                return {
                    a: topRightA,
                    b: bottomLeftB
                }

            }

            if(below) {

                /* right and below
                 */
                return {
                    a: this.bottomRight,
                    b: rectB.topLeft
                }

            }

        }


        /* at this point, rectB must be inside this
         * TODO: currently the expensive case, but must be a smarter way to do this
         */
        const sizeA = this.size()
        const halfSizeA = sizeA.multiplyScalar(0.5)
        const sizeB = rectB.size()
        const halfSizeB = sizeB.multiplyScalar(0.5)

        const points = [
            /* top left */ { a: Vec2.fromXY(this.topLeft.x, this.topLeft.y), b: Vec2.fromXY(rectB.topLeft.x, rectB.topLeft.y) },
            /* bottom right */ { a: Vec2.fromXY(this.bottomRight.x, this.bottomRight.y), b: Vec2.fromXY(rectB.bottomRight.x, rectB.bottomRight.y) },
            /* top right */ { a: Vec2.fromXY(this.bottomRight.x, this.topLeft.y), b: Vec2.fromXY(rectB.bottomRight.x, rectB.topLeft.y) },
            /* bottom left */ { a: Vec2.fromXY(this.topLeft.x, this.bottomRight.y), b: Vec2.fromXY(rectB.topLeft.x, rectB.bottomRight.y) },
            /* top mid */ { a: Vec2.fromXY(this.topLeft.x + halfSizeA.x, this.topLeft.y), b: Vec2.fromXY(rectB.topLeft.x + halfSizeB.x, rectB.topLeft.y) },
            /* bottom mid */ { a: Vec2.fromXY(this.topLeft.x + halfSizeA.x, this.bottomRight.y), b: Vec2.fromXY(rectB.topLeft.x + halfSizeB.x, rectB.bottomRight.y) },
            /* left mid */ { a: Vec2.fromXY(this.topLeft.x, this.topLeft.y + halfSizeA.y), b: Vec2.fromXY(rectB.topLeft.x, rectB.topLeft.y + halfSizeB.y) },
            /* right mid */ { a: Vec2.fromXY(this.topLeft.x + sizeA.x, this.topLeft.y + halfSizeA.y), b: Vec2.fromXY(rectB.topLeft.x + sizeB.x, rectB.topLeft.y + halfSizeB.y) },
        ]

        return points.sort((a, b) => {

            return a.a.distanceTo(a.b) - b.a.distanceTo(b.b)

        })[0]

    }

    distanceToRect(rectB:Rect):number {

        const points = this.closestPointsBetweenThisAnd(rectB)

        return points.a.distanceTo(points.b)

    }

    manhattanVectorToRect(rectB:Rect):Vec2 {

        const points = this.closestPointsBetweenThisAnd(rectB)

        return points.b.subtract(points.a)

    }

    intersectsLine(line:Line): boolean {

        if(this.intersectsPoint(line.a))
            return true

        if(this.intersectsPoint(line.b))
            return true

        if(line.intersectsLine(this.left()))
            return true

        if(line.intersectsLine(this.top()))
            return true

        if(line.intersectsLine(this.right()))
            return true

        if(line.intersectsLine(this.bottom()))
            return true

        return false
    }

    static fromPosAndSize(pos:Vec2, size: Vec2) {

        return new Rect(pos, pos.add(size))

    }

    static join(rects:Array<Rect>):Rect {

        var newRect = rects[0]

        rects.forEach((rect) => {
            newRect = newRect.surround(rect)
        })

        return newRect
    }

    toString():string {

        return 'Rect([' + this.topLeft.x + ', ' + this.topLeft.y + '] => [' + this.bottomRight.x + ', ' + this.bottomRight.y + '])'

    }

    round():Rect {

        return new Rect(
            this.topLeft.round(),
            this.bottomRight.round()
        )
    
    }

    static surroundingPoints(points:Vec2[]) {

        if(points.length === 0) {
            throw new Error('need at least 1 point')
        }

        let rect = Rect.fromPosAndSize(points[0], Vec2.fromXY(0, 0))

        for(let n = 1; n < points.length; ++ n) {
            rect = rect.surroundPoint(points[n])
        }

        return rect
    }

}


