
import Vec2 from './Vec2'
import almostEqual from './almostEqual'

/* Adapted from Python code at:
 *   http://stackoverflow.com/a/18524383/712294
 */
export default function closedSegmentIntersect(a,b,c,d) {

    if(a.equals(b))
        return a.equals(c) || a.equals(d)

    if(c.equals(d))
        return c.equals(a) || c.equals(b)

    var s1 = side(a, b, c)
    var s2 = side(a, b, d)

    if(s1 === 0 && s2 === 0) {

        return isPointInClosedSegment(a, b, c) ||
               isPointInClosedSegment(a, b, d) ||
               isPointInClosedSegment(c, d, a) ||
               isPointInClosedSegment(c, d, b)
    }

    if(s1 !== 0 && s1 === s2) {
        return false
    }

    s1 = side(c, d, a)
    s2 = side(c, d, b)

    if(s1 !== 0 && s1 === s2) {
        return false
    }

    return true
}

function side(a,b,c) {

    const d = (c.y - a.y) * (b.x - a.x) -
              (b.y - a.y) * (c.x - a.x)

    if(almostEqual(d, 0))
        return 0

    if(d > 0)
        return 1

    if(d < 0)
        return -1
}

function isPointInClosedSegment(a, b, c) {

    if(a.x < b.x)
        return a.x <= c.x && c.x <= b.x

    if(b.x < a.x)
        return b.x <= c.x && c.x <= a.x

    if(a.y < b.y)
        return a.y <= c.y && c.y <= b.y

    if(b.y < a.y)
        return b.y <= c.y && c.y <= a.y

    return a.equals(c)
}



