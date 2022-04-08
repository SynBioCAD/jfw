
import almostEqual = require('almost-equal')

export default function isAlmostEqual(a, b) {

    return almostEqual(a, b, almostEqual.DBL_EPSILON, almostEqual.DBL_EPSILON)

}


