
import { LinearRange } from '.'

export default class LinearRangeSet {
    
    ranges: Array<LinearRange>
    
    constructor(ranges?:Array<LinearRange>) {

        if (!ranges) {
            return new LinearRangeSet([])
        } else {
            this.ranges = ranges
            //return this.sort().pruneEmptyRanges()
        }
    }

    clone():LinearRangeSet {
        let newSet = new LinearRangeSet()

        for(let range of this.ranges) {
            newSet.push(new LinearRange(range.start, range.end))
        }

        return newSet
    }

    sort():LinearRangeSet {

        return new LinearRangeSet(
            this.ranges.slice(0).sort((a:LinearRange, b:LinearRange) => {
                return a.start - b.start
            })
        )
    }

    sortWithComparator(fn:(a:LinearRange,b:LinearRange)=>number):LinearRangeSet {

        return new LinearRangeSet(
            this.ranges.sort(fn)
        )
    }

    push(range:LinearRange):void {
        this.ranges.push(range)
    }

    pruneEmptyRanges():LinearRangeSet {

        return new LinearRangeSet(
            this.ranges.filter((range:LinearRange) => range.start !== range.end)
        )

    }

    invert():LinearRangeSet {

        let sorted = this.sort()

        var newSet = new LinearRangeSet()

        for (var i:number = 0; i < sorted.ranges.length; ++i) {

            const curRange:LinearRange = sorted.ranges[i]
            const nextRange:LinearRange = sorted.ranges[i + 1]

            if (nextRange === undefined)
                break

            newSet.push(new LinearRange(curRange.end, nextRange.start))
        }

        return newSet
    }

    expandToRange(superRange:LinearRange):LinearRangeSet {

        if (this.ranges.length === 0)
            return new LinearRangeSet([ new LinearRange(superRange.start, superRange.end) ])

        var newRanges:Array<LinearRange> = new Array<LinearRange>()

        newRanges.push(new LinearRange(superRange.start, this.ranges[0].start))
        newRanges = newRanges.concat(this.ranges)
        newRanges.push(new LinearRange(this.ranges[this.ranges.length - 1].end, superRange.end))

        return new LinearRangeSet(newRanges).pruneEmptyRanges()
    }

    intersectsRange(range:LinearRange):boolean {

        for(var i:number = 0; i < this.ranges.length; ++ i) {
            if(this.ranges[i].intersectsRange(range)) {
                return true
            }
        }

        return false

    }

    intersectingRangesWithRange(range:LinearRange):Array<LinearRange> {

        return this.ranges.filter((r:LinearRange) => r.intersectsRange(range))

    }

    reverse():LinearRangeSet {

        var newSet:LinearRangeSet = new LinearRangeSet()

        for(var i = this.ranges.length - 1; i >= 0; -- i) {

            const range = this.ranges[i]

            newSet.push(new LinearRange(range.end, range.start))
        }

        return newSet
    }

    flatten():LinearRangeSet {

        let sorted = this.sort().ranges

        let newSet = new LinearRangeSet()

        for(let i = 0; i < sorted.length; ) {
            let start = sorted[i].start
            let merged = new LinearRange(sorted[i].start, sorted[i].end)
            let j = i+1
            if (j === sorted.length) {
                newSet.push(merged)
                break
            }
            for(;;) {
                if(merged.intersectsRange(sorted[j])) {
                    merged = new LinearRange(
                        Math.min(sorted[j].start,merged.start),
                        Math.max(sorted[j].end, merged.end)
                    )
                    if (++j === sorted.length) {
                        newSet.push(merged)
                        break
                    }
                } else {
                    newSet.push(merged)
                    break
                }
            }
            i = j
        }

        return newSet
    }

    maxIntersectingRanges():number {

        /* TODO o(n^2) horribleness
        */
        var max:number = 0

        this.ranges.forEach((range:LinearRange) => {

            max = Math.max(
                this.intersectingRangesWithRange(range).length,
                max
            )

        })

        return max

    }

    forEach(callback:(LinearRange) => void) {

        this.ranges.forEach(callback)

    }

    isEmpty():boolean {

        return this.ranges.length === 0

    }

}





